const { parse } = require("csv-parse/sync");

class CsvParser {

    static parse(content) {

        const records = parse(content, {

            columns: true,

            skip_empty_lines: true,

            relax_quotes: true,

            relax_column_count: true

        });


        return records.map(record => {

            /*
             * =====================================================
             * GENERIC STRUCTURED EVENT FIELDS
             * =====================================================
             *
             * Different CSV datasets may use different names
             * for the same concept.
             */

            const eventName =
                record.event ||
                record.action ||
                record.operation ||
                record.event_type ||
                record.eventType ||
                null;


            const status =
                record.status ||
                record.result ||
                record.outcome ||
                null;


            const reason =
                record.reason ||
                record.failure_reason ||
                null;


            let normalizedEventName =
    eventName;


/*
 * Detect structured DNS records
 */

if (
    !normalizedEventName
    &&
    (
        record.query
        ||
        record.query_type
        ||
        record.response_ip
        ||
        record.dns_server
        ||
        record.rcode
    )
) {

    normalizedEventName =
        "dns_query";

}
            /*
             * =====================================================
             * MESSAGE
             * =====================================================
             *
             * Preserve as much structured information as possible.
             *
             * Priority:
             *
             * 1. message
             * 2. detail
             * 3. description
             * 4. command
             *
             * Then append event/status/reason when available.
             */

            const messageParts = [

                record.message,

                record.detail,

                record.description,

                record.command,

                eventName,

                status,

                reason

            ].filter(Boolean);


            const message =
                messageParts.join(" ");


            /*
             * =====================================================
             * EVENT TIME
             * =====================================================
             *
             * Supports:
             *
             * timestamp
             * time
             * datetime
             * date
             */

            let eventTime = null;


            const timestamp =
                record.timestamp ||
                record.time ||
                record.datetime ||
                record.date ||
                null;


            if (timestamp) {

                const parsedDate =
                    new Date(timestamp);


                if (
                    !isNaN(
                        parsedDate.getTime()
                    )
                ) {

                    eventTime =
                        parsedDate;

                }

            }


            /*
             * =====================================================
             * HOSTNAME
             * =====================================================
             *
             * Supports:
             *
             * hostname
             * host
             * target_host
             * destination_host
             */

            const hostname =
                record.hostname ||
                record.host ||
                record.target_host ||
                record.destination_host ||
                null;


            /*
             * =====================================================
             * SOURCE IP
             * =====================================================
             */

            const sourceIp =
                record.source_ip ||
                record.sourceIp ||
                record.srcIP ||
                record.src_ip ||
                record.srcip ||
                record.ip ||
                null;


            /*
             * =====================================================
             * DESTINATION IP
             * =====================================================
             */

            const destinationIp =
                record.destination_ip ||
                record.destinationIp ||
                record.dstIP ||
                record.dst_ip ||
                record.dstip ||
                null;


            /*
             * =====================================================
             * SOURCE PORT
             * =====================================================
             */

            const sourcePort =
                record.source_port ||
                record.sourcePort ||
                record.srcPort ||
                record.src_port ||
                record.srcport ||
                null;


            /*
             * =====================================================
             * DESTINATION PORT
             * =====================================================
             */

            const destinationPort =
                record.destination_port ||
                record.destinationPort ||
                record.dstPort ||
                record.dst_port ||
                record.dstport ||
                null;


            /*
             * =====================================================
             * USERNAME
             * =====================================================
             *
             * actor is preferred because it represents
             * the account performing the action.
             *
             * Example:
             *
             * actor       = helpdesk-admin
             * target_user = nlefort
             *
             * username = helpdesk-admin
             */

            const username =
                record.username ||
                record.user ||
                record.actor ||
                null;


            /*
             * =====================================================
             * SEVERITY
             * =====================================================
             */

            const severity =
                record.level
                    ? String(
                        record.level
                    ).toLowerCase()

                    : (

                        record.severity ||
                        "info"

                    );


            /*
             * =====================================================
             * RETURN EVENT
             * =====================================================
             */

            return {

                eventTime : 
                 record.timestamp
                ? new Date(record.timestamp)
                : null,

                hostname,

                source:
                    record.source ||
                    record.service ||
                    "csv",

                sourceIp:
                    record.source_ip ||
                    record.sourceIp ||
                    record.src_ip ||
                    record.srcIP ||
                    record.srcip ||
                    record.ip ||
                    null,

                destinationIp:
                    record.destination_ip ||
                    record.destinationIp ||
                    record.dst_ip ||
                    record.dstIP ||
                    record.dstip ||
                    record.dns_server ||
                    null,

                sourcePort:
                    record.source_port ||
                    record.sourcePort ||
                    record.srcPort ||
                    record.src_port ||
                    record.srcport ||
                    null,

                destinationPort:
                    record.destination_port ||
                    record.destinationPort ||
                    record.dstPort ||
                    record.dst_port ||
                    record.dstport ||
                    null,

                username:
                    record.username ||
                    record.user ||
                    record.actor ||
                    null,

                eventType:
                    normalizedEventName ||
                    "unknown",

                severity,

                /*
                * DNS-specific structured information
                */

                query:
                    record.query ||
                    record.domain ||
                    record.domain_name ||
                    null,

                queryType:
                    record.query_type ||
                    record.queryType ||
                    null,

                responseIp:
                    record.response_ip ||
                    record.responseIp ||
                    record.answer ||
                    null,

                ttl:
                    record.ttl ||
                    null,

                rcode:
                    record.rcode ||
                    null,

                status:
                    status,

                reason:
                    reason,

                event:
                    normalizedEventName,

                message,

                rawLog:
                    JSON.stringify(record)

};

        });

    }

}


module.exports = CsvParser;