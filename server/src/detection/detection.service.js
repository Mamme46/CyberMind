const pool = require("../config/database").pool;

const Alert = require("../models/alert.model");

const AlertEvent = require("../models/alertEvent.model");

const DetectionEngine = require("./detection.engine");

class DetectionService {

    static async analyze(uploadId) {

    console.log("=================================");
    console.log("DETECTION STARTED");
    console.log("Upload ID:", uploadId);

    const { rows: events } = await pool.query(

        `
        SELECT *
        FROM log_events
        WHERE upload_id = $1
        ORDER BY event_time ASC, id ASC
        `,

        [uploadId]

    );

    console.log("Events found:", events.length);

    if (events.length > 0) {

        console.log(
            "Event types:",
            events.map(event => event.event_type)
        );

    }

    const detections = DetectionEngine.run(events);

    console.log("Detections:", detections);

    for (const detection of detections) {

        console.log(
            "Creating alert:",
            detection.title
        );

        const rule = detection.rule;

        let { rows: ruleRows } = await pool.query(

            `
            SELECT id
            FROM detection_rules
            WHERE name = $1
            `,

            [rule.name]

        );

        let ruleId;

        if (ruleRows.length === 0) {

            const result = await pool.query(

                `
                INSERT INTO detection_rules(
                    name,
                    description,
                    severity,
                    mitre,
                    enabled
                )
                VALUES($1,$2,$3,$4,true)
                RETURNING id
                `,

                [
                    rule.name,
                    rule.description,
                    rule.severity,
                    rule.mitre
                ]

            );

            ruleId = result.rows[0].id;

        }

        else {

            ruleId = ruleRows[0].id;

        }

        const alert = await Alert.create({

            uploadId,

            title: detection.title,

            description: detection.description,

            severity: detection.severity,

            sourceIp: detection.sourceIp,

            username: detection.username

        });

        console.log("Alert created:", alert.id);

        for (const eventId of detection.eventIds) {

            await AlertEvent.create(

                alert.id,

                eventId

            );

            await pool.query(

                `
                INSERT INTO rule_matches(
                    rule_id,
                    log_event_id
                )
                VALUES($1,$2)
                ON CONFLICT(rule_id,log_event_id)
                DO NOTHING
                `,

                [
                    ruleId,
                    eventId
                ]

            );

        }

    }

    console.log("DETECTION FINISHED");
    console.log("=================================");

    return detections;

}

}

module.exports = DetectionService;