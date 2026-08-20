const { execFile } = require("child_process");
const path = require("path");

class SecurityService {

    static async scan() {

        const projectPath = path.resolve(__dirname, "../../../");

        const args = [
            "fs",
            "--format",
            "json",
            "--scanners",
            "vuln,secret,misconfig",
            "--skip-dirs",
            "C:\\Users\\mamme\\CyberMind\\node_modules",

            "--skip-dirs",
            "C:\\Users\\mamme\\CyberMind\\client\\node_modules",

            "--skip-dirs",
            "C:\\Users\\mamme\\CyberMind\\server\\node_modules",
            projectPath
        ];

        console.log("TRIVY PROJECT PATH:", projectPath);
        console.log("TRIVY ARGS:", args);
        return new Promise((resolve, reject) => {

            execFile(
                "trivy",
                args,
                {
                    timeout: 300000,
                    maxBuffer: 50 * 1024 * 1024
                },
                (error, stdout, stderr) => {

                    /*
                     * Trivy can return a non-zero exit code when
                     * findings are detected.
                     *
                     * Therefore, we don't immediately reject
                     * when error exists.
                     */

                    if (!stdout) {

                        return reject(
                            new Error(
                                stderr ||
                                error?.message ||
                                "Trivy scan failed."
                            )
                        );

                    }

                    try {

                        const result = JSON.parse(stdout);

                        resolve(result);

                    }

                    catch (parseError) {

                        reject(
                            new Error(
                                "Unable to parse Trivy JSON output."
                            )
                        );

                    }

                }
            );

        });

    }

}

module.exports = SecurityService;