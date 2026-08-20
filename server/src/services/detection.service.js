const pool = require("../config/database").pool;

const Alert = require("../models/alert.model");
const AlertEvent = require("../models/alertEvent.model");

const DetectionEngine =
    require("./detection/detection.engine");


class DetectionService {


    /*
     * =========================================================
     * ANALYZE UPLOAD
     * =========================================================
     *
     * 1. Retrieve normalized events
     * 2. Run all detection rules
     * 3. Create one Alert for each detection
     * 4. Link the alert to the events that triggered it
     */

    static async analyze(uploadId) {


        /*
         * =====================================================
         * 1. GET EVENTS
         * =====================================================
         */

        const { rows: events } =
            await pool.query(

                `
                SELECT *
                FROM log_events
                WHERE upload_id = $1
                ORDER BY event_time ASC
                `,

                [
                    uploadId
                ]

            );


        /*
         * No events = nothing to detect.
         */

        if (
            events.length === 0
        ) {

            return [];

        }


        /*
         * =====================================================
         * 2. RUN DETECTION ENGINE
         * =====================================================
         *
         * DetectionEngine is responsible for the rules.
         *
         * DetectionService does NOT know which rules exist.
         */

        const detections =
            DetectionEngine.run(
                events
            );


        /*
         * =====================================================
         * 3. CREATE ALERTS
         * =====================================================
         */

        const alerts = [];


        for (
            const detection
            of detections
        ) {


            /*
             * -------------------------------------------------
             * Create the alert
             * -------------------------------------------------
             */

            const alert =
                await Alert.create({

                    uploadId,

                    title:
                        detection.title ||
                        "Security Alert",

                    description:
                        detection.description ||
                        "Security event detected.",

                    severity:
                        detection.severity ||
                        "medium",

                    sourceIp:
                        detection.sourceIp ||
                        null,

                    username:
                        detection.username ||
                        null

                });


            /*
             * -------------------------------------------------
             * Link alert to triggering events
             * -------------------------------------------------
             *
             * Rules can return:
             *
             * eventIds: [1, 2, 3]
             *
             * We use AlertEvent as the relation between
             * alerts and log events.
             */

            const eventIds =
                Array.isArray(
                    detection.eventIds
                )
                    ? detection.eventIds
                    : [];


            /*
             * Remove duplicate event IDs.
             */

            const uniqueEventIds =
                [
                    ...new Set(
                        eventIds
                            .filter(
                                id =>
                                    id !== null
                                    &&
                                    id !== undefined
                            )
                    )
                ];


            /*
             * -------------------------------------------------
             * Create AlertEvent relations
             * -------------------------------------------------
             */

            for (
                const eventId
                of uniqueEventIds
            ) {

                await AlertEvent.create(

                    alert.id,

                    eventId

                );

            }


            /*
             * Add the created alert to the result.
             */

            alerts.push({

                ...alert,

                eventIds:
                    uniqueEventIds

            });

        }


        /*
         * =====================================================
         * 4. RETURN CREATED ALERTS
         * =====================================================
         */

        return alerts;

    }

}


module.exports =
    DetectionService;