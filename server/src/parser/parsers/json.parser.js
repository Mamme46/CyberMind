class JSONParser {

    static parse(content) {

        let data;

        try {

            data = JSON.parse(content);

        }

        catch (error) {

            throw new Error("Invalid JSON log file.");

        }

        if (!Array.isArray(data)) {

            data = [data];

        }

        return data.map(item => {

            const event = {

                eventTime:
                    item.event_time ||
                    item.timestamp ||
                    item.time ||
                    item.date ||
                    null,

                hostname:
                    item.hostname ||
                    item.host ||
                    null,

                source:
                    item.source ||
                    item.service ||
                    item.program ||
                    "json",

                sourceIp:
                    item.source_ip ||
                    item.src_ip ||
                    item.src ||
                    item.sourceIp ||
                    null,

                destinationIp:
                    item.destination_ip ||
                    item.dest_ip ||
                    item.dst_ip ||
                    item.destinationIp ||
                    null,

                username:
                    item.username ||
                    item.user ||
                    item.account ||
                    null,

                eventType:
                    item.event_type ||
                    item.eventType ||
                    item.event ||
                    item.action ||
                    "unknown",

                severity:
                    item.severity ||
                    item.level ||
                    "info",

                message:
                    item.message ||
                    item.msg ||
                    JSON.stringify(item),

                rawLog: JSON.stringify(item)

            };

            return event;

        });

    }

}

module.exports = JSONParser;