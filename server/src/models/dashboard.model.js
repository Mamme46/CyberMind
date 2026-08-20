const pool = require("../config/database").pool;

class Dashboard {

    static async getStats() {

        const uploads = await pool.query(
            "SELECT COUNT(*) FROM uploads"
        );

        const alerts = await pool.query(
            "SELECT COUNT(*) FROM alerts"
        );

        const criticalAlerts = await pool.query(
            "SELECT COUNT(*) FROM alerts WHERE severity='critical'"
        );

        const events = await pool.query(
            "SELECT COUNT(*) FROM log_events"
        );

        return {

            uploads: Number(uploads.rows[0].count),

            alerts: Number(alerts.rows[0].count),

            criticalAlerts: Number(criticalAlerts.rows[0].count),

            events: Number(events.rows[0].count)

        };

    }

    static async getRecentAlerts() {

        const { rows } = await pool.query(

            `

            SELECT

                id,

                title,

                severity,

                source_ip,

                username,

                status,

                created_at

            FROM alerts

            ORDER BY created_at DESC

            LIMIT 5

            `

        );

        return rows;

    }

}

module.exports = Dashboard;