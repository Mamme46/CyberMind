const AIService = require("./ai.service");
const PromptService = require("./prompt.service");

const Alert = require("../../models/alert.model");

const pool =
    require("../../config/database").pool;

const Report =
    require("../../models/report.model");

const env =
    require("../../config/env");


class AIReportService {


    /*
     * =========================================================
     * GENERATE AI REPORT
     * =========================================================
     */

    static async generate(alertId) {


        /*
         * =====================================================
         * 1. GET ALERT
         * =====================================================
         */

        const alert =
            await Alert.findById(
                alertId
            );


        if (!alert) {

            throw new Error(
                "Alert not found"
            );

        }


        /*
         * =====================================================
         * 2. GET EVENTS LINKED TO THE ALERT
         * =====================================================
         *
         * alerts
         *    ↓
         * alert_events
         *    ↓
         * log_events
         *
         * Current relation:
         *
         * alert_events.log_event_id
         */

        const { rows: events } =
            await pool.query(

                `
                SELECT
                    le.*

                FROM log_events le

                INNER JOIN alert_events ae
                    ON ae.log_event_id = le.id

                WHERE ae.alert_id = $1

                ORDER BY le.event_time ASC
                `,

                [
                    alertId
                ]

            );


        /*
         * =====================================================
         * 3. MAKE SURE EVENTS EXIST
         * =====================================================
         */

        if (
            events.length === 0
        ) {

            throw new Error(
                `No log events are linked to alert ${alertId}`
            );

        }


        /*
         * =====================================================
         * 4. FORMAT EVENTS
         * =====================================================
         *
         * These are the normalized facts extracted from the
         * original logs.
         */

        const formattedEvents =
            events.map(
                event => ({

                    id:
                        event.id,

                    event_time:
                        event.event_time ||
                        null,

                    hostname:
                        event.hostname ||
                        null,

                    source:
                        event.source ||
                        null,

                    service:
                        event.service ||
                        null,

                    source_ip:
                        event.source_ip ||
                        null,

                    destination_ip:
                        event.destination_ip ||
                        null,

                    username:
                        event.username ||
                        null,

                    event_type:
                        event.event_type ||
                        null,

                    severity:
                        event.severity ||
                        null,

                    message:
                        event.message ||
                        null,

                    raw_log:
                        event.raw_log ||
                        null,

                    source_port:
                        event.source_port ||
                        null,

                    destination_port:
                        event.destination_port ||
                        null,

                    /*
                     * DNS
                     */

                    query:
                        event.query ||
                        null,

                    query_type:
                        event.query_type ||
                        null,

                    response_ip:
                        event.response_ip ||
                        null,

                    ttl:
                        event.ttl ||
                        null,

                    dns_server:
                        event.dns_server ||
                        null,

                    rcode:
                        event.rcode ||
                        null

                })
            );


        /*
         * =====================================================
         * 5. BUILD DETECTION INFORMATION
         * =====================================================
         */

        const detection = {

            rule:
                alert.title ||
                null,

            description:
                alert.description ||
                null,

            severity:
                alert.severity ||
                null,

            status:
                alert.status ||
                null,

            source_ip:
                alert.source_ip ||
                null,

            username:
                alert.username ||
                null,

            detection_time:
                alert.created_at ||
                null,

            event_count:
                formattedEvents.length,

            event_ids:
                formattedEvents.map(
                    event =>
                        event.id
                )

        };


        /*
         * =====================================================
         * 6. MITRE ATT&CK
         * =====================================================
         *
         * MITRE must come from the detection logic / alert.
         *
         * Qwen must NOT invent the technique.
         */

        let mitre = [];


        if (
            Array.isArray(
                alert.mitre
            )
        ) {

            mitre =
                alert.mitre;

        }

        else if (
            alert.mitre
        ) {

            mitre = [
                alert.mitre
            ];

        }

        else if (
            alert.mitre_id
        ) {

            mitre = [

                {

                    id:
                        alert.mitre_id,

                    name:
                        alert.mitre_name ||
                        null

                }

            ];

        }


        /*
         * =====================================================
         * 7. BUILD EVIDENCE
         * =====================================================
         *
         * Evidence is extracted directly from observed events.
         *
         * No AI inference is performed here.
         */

        const evidence = {

            event_ids:
                formattedEvents
                    .map(
                        event =>
                            event.id
                    ),

            hosts:
                [
                    ...new Set(
                        formattedEvents
                            .map(
                                event =>
                                    event.hostname
                            )
                            .filter(Boolean)
                    )
                ],

            users:
                [
                    ...new Set(
                        formattedEvents
                            .map(
                                event =>
                                    event.username
                            )
                            .filter(Boolean)
                    )
                ],

            source_ips:
                [
                    ...new Set(
                        formattedEvents
                            .map(
                                event =>
                                    event.source_ip
                            )
                            .filter(Boolean)
                    )
                ],

            destination_ips:
                [
                    ...new Set(
                        formattedEvents
                            .map(
                                event =>
                                    event.destination_ip
                            )
                            .filter(Boolean)
                    )
                ],

            source_ports:
                [
                    ...new Set(
                        formattedEvents
                            .map(
                                event =>
                                    event.source_port
                            )
                            .filter(Boolean)
                    )
                ],

            destination_ports:
                [
                    ...new Set(
                        formattedEvents
                            .map(
                                event =>
                                    event.destination_port
                            )
                            .filter(Boolean)
                    )
                ],

            domains:
                [
                    ...new Set(
                        formattedEvents
                            .map(
                                event =>
                                    event.query
                            )
                            .filter(Boolean)
                    )
                ],

            commands:
                [
                    ...new Set(
                        formattedEvents
                            .map(
                                event =>
                                    event.message
                            )
                            .filter(
                                message =>
                                    message &&
                                    (
                                        /command\s*=/i.test(
                                            message
                                        )
                                        ||
                                        /\b(?:bash|sh|nc|curl|wget|python|python3|powershell|cmd|sudo)\b/i.test(
                                            message
                                        )
                                    )
                            )
                    )
                ]

        };


        /*
         * =====================================================
         * 8. BUILD TIMELINE
         * =====================================================
         *
         * Timeline is deterministic.
         *
         * Qwen is not allowed to create or modify events.
         */

        const timeline =
            formattedEvents.map(
                event => ({

                    eventId:
                        event.id,

                    time:
                        event.event_time,

                    type:
                        event.event_type,

                    severity:
                        event.severity,

                    hostname:
                        event.hostname,

                    sourceIp:
                        event.source_ip,

                    destinationIp:
                        event.destination_ip,

                    sourcePort:
                        event.source_port,

                    destinationPort:
                        event.destination_port,

                    username:
                        event.username,

                    description:
                        event.message

                })
            );


        /*
         * =====================================================
         * 9. BUILD INDICATORS
         * =====================================================
         *
         * These values are directly observable in the logs.
         */

        const indicators = {

            source_ips:
                evidence.source_ips,

            destination_ips:
                evidence.destination_ips,

            usernames:
                evidence.users,

            hostnames:
                evidence.hosts,

            domains:
                evidence.domains,

            ports:
                [
                    ...new Set(
                        [
                            ...evidence.source_ports,
                            ...evidence.destination_ports
                        ]
                    )
                ],

            commands:
                evidence.commands

        };


        /*
         * =====================================================
         * 10. BUILD REPORT DATA
         * =====================================================
         */

        const reportData = {

            alert: {

                id:
                    alert.id,

                title:
                    alert.title,

                description:
                    alert.description,

                severity:
                    alert.severity,

                status:
                    alert.status,

                source_ip:
                    alert.source_ip ||
                    null,

                username:
                    alert.username ||
                    null,

                created_at:
                    alert.created_at

            },

            detection,

            events:
                formattedEvents,

            evidence,

            timeline,

            indicators,

            mitre

        };


        /*
         * =====================================================
         * 11. BUILD AI PROMPT
         * =====================================================
         */

        const prompt =
            PromptService.generateReport(
                reportData
            );


        /*
         * =====================================================
         * 12. VALIDATE PROMPT
         * =====================================================
         */

        if (
            typeof prompt !==
            "string"
        ) {

            console.error(
                "Invalid AI prompt:",
                prompt
            );

            throw new Error(
                "PromptService.generateReport() must return a string"
            );

        }


        /*
         * =====================================================
         * 13. GENERATE AI ANALYSIS
         * =====================================================
         */

        const aiReport =
            await AIService.generateReport(
                prompt
            );


        /*
         * =====================================================
         * 14. VALIDATE AI RESPONSE
         * =====================================================
         */

        if (
            !aiReport
            ||
            typeof aiReport !==
            "object"
            ||
            Array.isArray(aiReport)
        ) {

            throw new Error(
                "AI returned an invalid report"
            );

        }


        /*
         * =====================================================
         * 15. ENSURE ASSESSMENT
         * =====================================================
         */

        if (
            !aiReport.assessment
            ||
            typeof aiReport.assessment !==
            "object"
        ) {

            throw new Error(
                "AI report is missing assessment"
            );

        }


        /*
         * =====================================================
         * 16. ENSURE TECHNICAL ANALYSIS
         * =====================================================
         */

        if (
            !aiReport.technical_analysis
            ||
            typeof aiReport.technical_analysis !==
            "object"
        ) {

            aiReport.technical_analysis = {

                what_happened:
                    "",

                detection_reason:
                    "",

                evidence_analysis:
                    "",

                affected_entities:
                    ""

            };

        }


        /*
         * =====================================================
         * 17. ENSURE RISK ASSESSMENT
         * =====================================================
         */

        if (
            !aiReport.risk_assessment
            ||
            typeof aiReport.risk_assessment !==
            "object"
        ) {

            aiReport.risk_assessment = {

                level:
                    alert.severity ||
                    "unknown",

                impact:
                    "",

                uncertainties:
                    ""

            };

        }


        /*
         * =====================================================
         * 18. ENSURE RECOMMENDATIONS
         * =====================================================
         */

        if (
            !Array.isArray(
                aiReport.recommendations
            )
        ) {

            aiReport.recommendations = [];

        }


        /*
         * =====================================================
         * 19. ENSURE CONCLUSION
         * =====================================================
         */

        if (
            typeof aiReport.conclusion !==
            "string"
        ) {

            aiReport.conclusion =
                "";

        }


        /*
         * =====================================================
         * 20. BUILD FINAL REPORT
         * =====================================================
         *
         * Important:
         *
         * These sections come from the BACKEND.
         *
         * They are not generated by Qwen.
         */

        const finalReport = {

            assessment:
                aiReport.assessment,

            technical_analysis:
                aiReport.technical_analysis,

            risk_assessment:
                aiReport.risk_assessment,

            evidence,

            timeline,

            indicators,

            mitre,

            recommendations:
                aiReport.recommendations,

            conclusion:
                aiReport.conclusion

        };


        /*
         * =====================================================
         * 21. SAVE REPORT
         * =====================================================
         */

        await Report.create({

            alertId:
                alert.id,

            title:
                alert.title,

            content:
                JSON.stringify(
                    finalReport,
                    null,
                    2
                ),

            model:
                env.OLLAMA_MODEL

        });


        /*
         * =====================================================
         * 22. RETURN FINAL REPORT
         * =====================================================
         */

        return finalReport;

    }

}


module.exports =
    AIReportService;