const path = require("path");

class FormatDetector {

    static detect(filePath, content) {

        const extension = path
            .extname(filePath)
            .toLowerCase();

        if (extension === ".json") {

            return "json";

        }

        if (
            extension === ".csv" ||
            extension === ".tsv"
        ) {

            return "csv";

        }

        /*
         * Try to detect JSON even if the
         * file does not have .json extension.
         */

        const trimmed = content.trim();

        if (
            trimmed.startsWith("{") ||
            trimmed.startsWith("[")
        ) {

            try {

                JSON.parse(trimmed);

                return "json";

            }

            catch (error) {

                // Not valid JSON
            }

        }

        /*
         * Most Linux / SSH / firewall logs
         * are line-based syslog-like logs.
         */

        if (
            trimmed.match(
                /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s/
            )
        ) {

            return "syslog";

        }

        return "generic";

    }

}

module.exports = FormatDetector;