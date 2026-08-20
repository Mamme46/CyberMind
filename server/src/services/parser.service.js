const fs = require("fs");

const LogEvent =
    require("../models/logEvent.model");

const FormatDetector =
    require("../parser/formatDetector");

const SyslogParser =
    require("../parser/parsers/syslog.parser");

const JSONParser =
    require("../parser/parsers/json.parser");

const GenericParser =
    require("../parser/parsers/generic.parser");

const CsvParser =
    require("../parser/parsers/csv.parser");

const EventNormalizer =
    require("../parser/normalizers/event.normalizer");


class ParserService {

    static async parse(upload) {

        const content =
            fs.readFileSync(
                upload.filePath,
                "utf8"
            );

        const format =
            FormatDetector.detect(
                upload.filePath,
                content
            );

        console.log(
            `Detected log format: ${format}`
        );


        /*
         * =====================================================
         * JSON
         * =====================================================
         */

        if (format === "json") {

            const events =
                JSONParser.parse(content);

            for (const event of events) {

                const normalized =
                    EventNormalizer.normalize(
                        event
                    );

                await LogEvent.create({

                    uploadId: upload.id,

                    ...normalized

                });

            }

            return events.length;

        }


        /*
         * =====================================================
         * CSV
         * =====================================================
         */

        if (format === "csv") {

            const events =
                CsvParser.parse(content);

            console.log(
                "CSV EVENTS COUNT:",
                events.length
            );

            console.log(
                "FIRST CSV EVENT:",
                events[0]
            );

            for (const event of events) {

                const normalized =
                    EventNormalizer.normalize(
                        event
                    );

                await LogEvent.create({

                    uploadId: upload.id,

                    ...normalized

                });

            }

            console.log(
                `Parsed ${events.length} CSV events.`
            );

            return events.length;

        }


        /*
         * =====================================================
         * LINE-BASED LOGS
         * =====================================================
         */

        const lines =
            content.split(/\r?\n/);

        let count = 0;

        for (const line of lines) {

            if (!line.trim()) {
                continue;
            }

            let event;

            if (format === "syslog") {

                event =
                    SyslogParser.parseLine(
                        line
                    );

            } else {

                event =
                    GenericParser.parseLine(
                        line
                    );

            }


            /*
             * Normalize event
             */

            const normalized =
                EventNormalizer.normalize(
                    event
                );


            await LogEvent.create({

                uploadId: upload.id,

                ...normalized

            });


            count++;

        }

        console.log(
            `Parsed ${count} events.`
        );

        return count;

    }

}


module.exports = ParserService;