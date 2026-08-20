const Investigation = require("../models/investigation.model");

class InvestigationService {

    static async investigate(alertId) {

        const alert = await Investigation.getAlert(alertId);

        if (!alert) {
            throw new Error("Alert not found.");
        }

        const events = await Investigation.getEvents(alertId);

        const summary = {

            totalEvents: events.length,

            failedLogins: events.filter(
                e => e.event_type === "login_failed"
            ).length,

            successfulLogins: events.filter(
                e => e.event_type === "login_success"
            ).length,

            sourceIPs: [
                ...new Set(
                    events
                        .map(e => e.source_ip)
                        .filter(Boolean)
                )
            ],

            users: [
                ...new Set(
                    events
                        .map(e => e.username)
                        .filter(Boolean)
                )
            ]

        };

        const timeline = events.map(event => ({

            eventId: event.id,

            time: event.event_time || event.created_at,

            type: event.event_type,

            severity: event.severity,

            source: event.source,

            sourceIp: event.source_ip,

            destinationIp: event.destination_ip,

            username: event.username,

            description: event.message

        }));

        return {

            alert,

            summary,

            timeline,

            events

        };

    }

}

module.exports = InvestigationService;

