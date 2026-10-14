const { pool } = require("../../config/database");

const InvestigationService = require("../investigation.service");

/*
 * Builds the "knowledge" the chatbot has about the application:
 * global statistics, alerts, uploads, reports and, when the question
 * mentions a specific alert, IP address or user, the matching details.
 *
 * The context is kept compact on purpose: the model runs on CPU and a
 * long prompt makes every answer slower.
 */

const MAX_ALERTS = 25;
const MAX_UPLOADS = 10;
const MAX_REPORTS = 10;
const MAX_TIMELINE = 15;
const MAX_HISTORY = 6;

const IP_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

const ALERT_ID_REGEX =
    /(?:alerts?|alertes?|incidents?|#)\s*(?:n[°o]\s*)?#?\s*(\d+)/gi;


function cut(text, max) {

    if (!text) return "";

    const clean = String(text).replace(/\s+/g, " ").trim();

    return clean.length > max
        ? clean.slice(0, max) + "..."
        : clean;

}

function date(value) {

    if (!value) return "?";

    return new Date(value).toISOString().slice(0, 16).replace("T", " ");

}

function formatAlert(a) {

    return `#${a.id} [${a.severity || "?"}/${a.status || "?"}] ` +
        `${cut(a.title, 80)} | ip=${a.source_ip || "-"} ` +
        `| user=${a.username || "-"} | ${date(a.created_at)} ` +
        `| upload #${a.upload_id ?? "-"}`;

}


class AppContextService {

    /*
     * Global overview: always included.
     */
    static async overview() {

        const [counts, bySeverity, byStatus, topIps] =
            await Promise.all([

                pool.query(
                    `SELECT
                        (SELECT COUNT(*) FROM uploads) AS uploads,
                        (SELECT COUNT(*) FROM alerts) AS alerts,
                        (SELECT COUNT(*) FROM log_events) AS events,
                        (SELECT COUNT(*) FROM reports) AS reports,
                        (SELECT COUNT(*) FROM users) AS users`
                ),

                pool.query(
                    `SELECT COALESCE(severity,'unknown') AS k, COUNT(*) AS n
                     FROM alerts GROUP BY 1 ORDER BY n DESC`
                ),

                pool.query(
                    `SELECT COALESCE(status,'unknown') AS k, COUNT(*) AS n
                     FROM alerts GROUP BY 1 ORDER BY n DESC`
                ),

                pool.query(
                    `SELECT source_ip, COUNT(*) AS n
                     FROM alerts WHERE source_ip IS NOT NULL
                     GROUP BY source_ip ORDER BY n DESC LIMIT 5`
                )

            ]);

        const c = counts.rows[0];

        const list = rows =>
            rows.map(r => `${r.k}=${r.n}`).join(", ") || "none";

        return [
            `Totals: ${c.uploads} uploaded log files, ${c.events} log ` +
            `events, ${c.alerts} alerts, ${c.reports} AI reports, ` +
            `${c.users} users.`,
            `Alerts by severity: ${list(bySeverity.rows)}.`,
            `Alerts by status: ${list(byStatus.rows)}.`,
            `Top source IPs by number of alerts: ` +
            (topIps.rows
                .map(r => `${r.source_ip} (${r.n})`)
                .join(", ") || "none") + "."
        ].join("\n");

    }


    static async recentAlerts() {

        const { rows } = await pool.query(
            `SELECT id, upload_id, title, severity, status,
                    source_ip, username, created_at
             FROM alerts
             ORDER BY created_at DESC, id DESC
             LIMIT $1`,
            [MAX_ALERTS]
        );

        return rows.map(formatAlert).join("\n") || "No alerts.";

    }


    static async recentUploads() {

        const { rows } = await pool.query(
            `SELECT id, original_name, file_size, parser_status,
                    uploaded_at,
                    (SELECT COUNT(*) FROM log_events e
                      WHERE e.upload_id = uploads.id) AS events,
                    (SELECT COUNT(*) FROM alerts a
                      WHERE a.upload_id = uploads.id) AS alerts
             FROM uploads
             ORDER BY uploaded_at DESC
             LIMIT $1`,
            [MAX_UPLOADS]
        );

        return rows.map(u =>
            `#${u.id} ${cut(u.original_name, 60)} | ` +
            `${Math.round(Number(u.file_size) / 1024)} KB | ` +
            `${u.events} events, ${u.alerts} alerts | ` +
            `${u.parser_status || "?"} | ${date(u.uploaded_at)}`
        ).join("\n") || "No uploads.";

    }


    static async recentReports() {

        const { rows } = await pool.query(
            `SELECT id, alert_id, title, created_at
             FROM reports
             ORDER BY created_at DESC
             LIMIT $1`,
            [MAX_REPORTS]
        );

        return rows.map(r =>
            `#${r.id} "${cut(r.title, 70)}" (alert #${r.alert_id}, ` +
            `${date(r.created_at)})`
        ).join("\n") || "No reports.";

    }


    /*
     * Full detail of one alert (summary + timeline).
     */
    static async alertDetail(alertId) {

        let investigation;

        try {

            investigation = await InvestigationService.investigate(alertId);

        } catch {

            return `Alert #${alertId}: not found in the application.`;

        }

        const { alert, summary, timeline } = investigation;

        const lines = [
            `ALERT #${alert.id} DETAIL`,
            formatAlert(alert),
            `Description: ${cut(alert.description, 400)}`,
            `Events: ${summary.totalEvents} total, ` +
            `${summary.failedLogins} failed logins, ` +
            `${summary.successfulLogins} successful logins.`,
            `Source IPs: ${summary.sourceIPs.join(", ") || "-"}. ` +
            `Users: ${summary.users.join(", ") || "-"}.`,
            `Timeline (first ${Math.min(timeline.length, MAX_TIMELINE)}):`
        ];

        for (const e of timeline.slice(0, MAX_TIMELINE)) {

            lines.push(
                `- ${date(e.time)} ${e.type || "?"} ` +
                `ip=${e.sourceIp || "-"} user=${e.username || "-"} ` +
                `${cut(e.description, 90)}`
            );

        }

        return lines.join("\n");

    }


    /*
     * Everything the application knows about an IP address.
     */
    static async ipDetail(ip) {

        const [alerts, events] = await Promise.all([

            pool.query(
                `SELECT id, upload_id, title, severity, status,
                        source_ip, username, created_at
                 FROM alerts WHERE source_ip = $1
                 ORDER BY created_at DESC LIMIT 10`,
                [ip]
            ),

            pool.query(
                `SELECT COALESCE(event_type,'unknown') AS k, COUNT(*) AS n
                 FROM log_events
                 WHERE source_ip = $1 OR destination_ip = $1
                 GROUP BY 1 ORDER BY n DESC LIMIT 8`,
                [ip]
            )

        ]);

        return [
            `IP ${ip} DETAIL`,
            `Alerts from this IP: ` +
            (alerts.rows.length ? "" : "none"),
            ...alerts.rows.map(formatAlert),
            `Log events involving this IP by type: ` +
            (events.rows.map(r => `${r.k}=${r.n}`).join(", ") || "none")
        ].join("\n");

    }


    /*
     * Alerts of a user name mentioned in the question.
     */
    static async userDetail(username) {

        const { rows } = await pool.query(
            `SELECT id, upload_id, title, severity, status,
                    source_ip, username, created_at
             FROM alerts WHERE username = $1
             ORDER BY created_at DESC LIMIT 10`,
            [username]
        );

        return [
            `USER "${username}" DETAIL`,
            ...rows.map(formatAlert)
        ].join("\n");

    }


    /*
     * Looks at the question and returns the relevant detail sections.
     */
    static async focus(question, alertId) {

        const sections = [];

        const alertIds = new Set();

        if (alertId) alertIds.add(Number(alertId));

        for (const m of question.matchAll(ALERT_ID_REGEX)) {

            alertIds.add(Number(m[1]));

        }

        // Keep prompts small: at most 2 detailed alerts.
        for (const id of [...alertIds].slice(0, 2)) {

            sections.push(await this.alertDetail(id));

        }

        const ips = [...new Set(question.match(IP_REGEX) || [])];

        for (const ip of ips.slice(0, 2)) {

            sections.push(await this.ipDetail(ip));

        }

        const { rows } = await pool.query(
            `SELECT DISTINCT username FROM alerts
             WHERE username IS NOT NULL`
        );

        const lower = question.toLowerCase();

        const users = rows
            .map(r => r.username)
            .filter(u => u.length >= 3 && lower.includes(u.toLowerCase()));

        for (const user of users.slice(0, 2)) {

            sections.push(await this.userDetail(user));

        }

        return sections;

    }


    /*
     * Last messages of the conversation, so follow-up questions
     * ("and this one?") make sense.
     */
    static formatHistory(messages, question) {

        let history = [...(messages || [])];

        const last = history[history.length - 1];

        // The current question is already saved: do not repeat it.
        if (last && last.role === "user" && last.content === question) {

            history.pop();

        }

        return history
            .slice(-MAX_HISTORY)
            .map(m =>
                `${m.role === "user" ? "User" : "Assistant"}: ` +
                cut(m.content, 500)
            )
            .join("\n");

    }


    static async build({ question, alertId, messages }) {

        const [overview, alerts, uploads, reports, focus] =
            await Promise.all([
                this.overview(),
                this.recentAlerts(),
                this.recentUploads(),
                this.recentReports(),
                this.focus(question, alertId)
            ]);

        const history = this.formatHistory(messages, question);

        return `You are CyberMind AI, the built-in security assistant of the CyberMind platform (a log analysis and threat detection application).

You are directly connected to the application's database. The DATA below is the live content of the application: use it to answer. Never say that you cannot access the application or its alerts, logs, uploads or reports. If something is not in the DATA, say it is not present in the application data instead of inventing it.
Reply in the same language as the user's question. Be concise and precise, and refer to alerts by their number (e.g. #12).

=== APPLICATION DATA ===
${overview}

Most recent alerts (id [severity/status] title | source ip | user | date | upload):
${alerts}

Recent uploaded log files:
${uploads}

Recent AI reports:
${reports}
${focus.length ? "\n=== DETAILS RELATED TO THE QUESTION ===\n" + focus.join("\n\n") + "\n" : ""}
${history ? "=== CONVERSATION SO FAR ===\n" + history + "\n" : ""}
=== QUESTION ===
${question}

Answer:`;

    }

}

module.exports = AppContextService;
