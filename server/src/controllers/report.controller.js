const ReportService = require("../services/report.service");
const PDFDocument = require("pdfkit");


class ReportController {


    /*
     * =========================================================
     * GET ALL REPORTS
     * =========================================================
     */

    static async getReports(req, res) {

        try {

            const reports =
                await ReportService.getReports();

            res.json({

                success: true,

                data: reports

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }


    /*
     * =========================================================
     * GET ONE REPORT
     * =========================================================
     */

    static async getReport(req, res) {

        try {

            const report =
                await ReportService.getReport(
                    req.params.id
                );

            if (!report) {

                return res.status(404).json({

                    success: false,

                    message: "Report not found"

                });

            }

            res.json({

                success: true,

                data: report

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }


    /*
     * =========================================================
     * DELETE REPORT
     * =========================================================
     */

    static async deleteReport(req, res) {

        try {

            await ReportService.deleteReport(
                req.params.id
            );

            res.json({

                success: true,

                message: "Report deleted."

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }


    /*
     * =========================================================
     * DOWNLOAD PDF
     * =========================================================
     */

    static async downloadPDF(req, res) {

        try {

            /*
             * -------------------------------------------------
             * GET REPORT
             * -------------------------------------------------
             */

            const report =
                await ReportService.getReport(
                    req.params.id
                );


            if (!report) {

                return res.status(404).json({

                    success: false,

                    message: "Report not found"

                });

            }


            /*
             * -------------------------------------------------
             * PARSE STRUCTURED AI REPORT
             * -------------------------------------------------
             *
             * report.content contains JSON because the AI
             * report is now stored as structured JSON.
             */

            let data;


            try {

                data =
                    typeof report.content === "string"

                        ? JSON.parse(
                            report.content
                        )

                        : report.content;

            }

            catch (error) {

                /*
                 * Compatibility with old reports that were
                 * stored as plain text.
                 */

                data = {

                    assessment: {

                        summary:
                            report.content || ""

                    },

                    findings: [],

                    timeline: [],

                    mitre: [],

                    indicators: {},

                    recommendations: [],

                    conclusion: ""

                };

            }


            /*
             * -------------------------------------------------
             * CREATE PDF
             * -------------------------------------------------
             */

            const doc =
                new PDFDocument({

                    margin: 50,

                    size: "A4",

                    bufferPages: true

                });


            res.setHeader(

                "Content-Type",

                "application/pdf"

            );


            res.setHeader(

                "Content-Disposition",

                `attachment; filename=CyberMind_Report_${report.id}.pdf`

            );


            doc.pipe(res);


            /*
             * -------------------------------------------------
             * COLORS
             * -------------------------------------------------
             */

            const colors = {

                dark: "#172033",

                secondary: "#5f6b7a",

                border: "#d9dee7",

                light: "#f4f6f8",

                white: "#ffffff",

                high: "#e67e22",

                critical: "#c0392b",

                medium: "#2980b9",

                low: "#27ae60"

            };


            /*
             * -------------------------------------------------
             * HELPERS
             * -------------------------------------------------
             */

            function safe(value, fallback = "-") {

                if (
                    value === null ||
                    value === undefined ||
                    value === ""
                ) {

                    return fallback;

                }

                return String(value);

            }


            function addPageIfNeeded(
                requiredHeight = 80
            ) {

                if (
                    doc.y +
                    requiredHeight >
                    doc.page.height -
                    doc.page.margins.bottom
                ) {

                    doc.addPage();

                }

            }


            function sectionTitle(
                title
            ) {

                addPageIfNeeded(70);

                doc
                    .moveDown(0.5)
                    .fontSize(17)
                    .font("Helvetica-Bold")
                    .fillColor(colors.dark)
                    .text(title);

                doc
                    .moveDown(0.25)
                    .strokeColor(colors.border)
                    .moveTo(
                        doc.page.margins.left,
                        doc.y
                    )
                    .lineTo(
                        doc.page.width -
                        doc.page.margins.right,
                        doc.y
                    )
                    .stroke();

                doc
                    .moveDown(0.7);

            }


            function labelValue(
                label,
                value
            ) {

                addPageIfNeeded(35);

                doc
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .fillColor(colors.secondary)
                    .text(
                        label
                    );

                doc
                    .font("Helvetica")
                    .fontSize(11)
                    .fillColor("#000000")
                    .text(
                        safe(value)
                    );

                doc.moveDown(0.45);

            }


            function bullet(
                text
            ) {

                addPageIfNeeded(35);

                doc
                    .font("Helvetica")
                    .fontSize(10.5)
                    .fillColor("#000000")
                    .text(
                        `• ${safe(text)}`,
                        {
                            width:
                                doc.page.width -
                                doc.page.margins.left -
                                doc.page.margins.right -
                                10
                        }
                    );

                doc.moveDown(0.25);

            }


            function paragraph(
                text
            ) {

                if (!text) {

                    return;

                }

                addPageIfNeeded(45);

                doc
                    .font("Helvetica")
                    .fontSize(10.5)
                    .fillColor("#000000")
                    .text(
                        safe(text),
                        {
                            align: "left",
                            lineGap: 3
                        }
                    );

                doc.moveDown(0.6);

            }


            function arrayValues(
                values
            ) {

                if (!Array.isArray(values)) {

                    return [];

                }

                return values;

            }


            /*
             * -------------------------------------------------
             * REPORT HEADER
             * -------------------------------------------------
             */

            doc
                .font("Helvetica-Bold")
                .fontSize(24)
                .fillColor(colors.dark)
                .text(
                    "CyberMind"
                );


            doc
                .font("Helvetica")
                .fontSize(15)
                .fillColor(colors.secondary)
                .text(
                    "AI Security Incident Report"
                );


            doc.moveDown(1);


            doc
                .font("Helvetica-Bold")
                .fontSize(20)
                .fillColor("#000000")
                .text(
                    safe(report.title)
                );


            doc.moveDown(0.5);


            labelValue(
                "Model",
                report.model
            );


            labelValue(
                "Generated",
                report.created_at
                    ? new Date(
                        report.created_at
                    ).toLocaleString()
                    : "-"
            );


            /*
             * -------------------------------------------------
             * SEVERITY
             * -------------------------------------------------
             */

            const severity =
                data.assessment?.severity ||
                "Unknown";


            doc
                .font("Helvetica-Bold")
                .fontSize(11)
                .fillColor(
                    getSeverityColor(
                        severity
                    )
                )
                .text(
                    `SEVERITY: ${String(
                        severity
                    ).toUpperCase()}`
                );


            doc.moveDown(1);


            /*
             * =================================================
             * EXECUTIVE ASSESSMENT
             * =================================================
             */

            sectionTitle(
                "Executive Assessment"
            );


            labelValue(
                "Attack Type",
                data.assessment?.attack_type
            );


            labelValue(
                "Severity",
                data.assessment?.severity
            );


            labelValue(
                "Confidence",
                data.assessment?.confidence
            );


            labelValue(
                "Impact",
                data.assessment?.impact
            );


            paragraph(
                data.assessment?.summary
            );


            /*
             * =================================================
             * TECHNICAL ANALYSIS
             * =================================================
             */

            sectionTitle(
                "Technical Analysis"
            );


            const technical =
                data.technical_analysis ||
                {};


            labelValue(
                "What happened",
                technical.what_happened
            );


            labelValue(
                "Detection reason",
                technical.detection_reason
            );


            labelValue(
                "Evidence analysis",
                technical.evidence_analysis
            );


            labelValue(
                "Affected entities",
                technical.affected_entities
            );


            /*
             * =================================================
             * OBSERVED EVIDENCE
             * =================================================
             */

            sectionTitle(
                "Observed Evidence"
            );


            const evidence =
                data.evidence ||
                {};


            writeListSection(
                doc,
                "Hosts",
                evidence.hosts,
                bullet
            );


            writeListSection(
                doc,
                "Users",
                evidence.users,
                bullet
            );


            writeListSection(
                doc,
                "Source IPs",
                evidence.source_ips,
                bullet
            );


            writeListSection(
                doc,
                "Destination IPs",
                evidence.destination_ips,
                bullet
            );


            if (
                Array.isArray(
                    evidence.commands
                ) &&
                evidence.commands.length > 0
            ) {

                doc
                    .font("Helvetica-Bold")
                    .fontSize(11)
                    .fillColor(colors.dark)
                    .text(
                        "Observed Commands"
                    );

                doc.moveDown(0.4);


                for (
                    const command
                    of evidence.commands
                ) {

                    addPageIfNeeded(50);

                    doc
                        .font("Courier")
                        .fontSize(9)
                        .fillColor("#000000")
                        .text(
                            safe(command),
                            {
                                width:
                                    doc.page.width -
                                    doc.page.margins.left -
                                    doc.page.margins.right,
                                lineGap: 2
                            }
                        );

                    doc.moveDown(0.5);

                }

            }


            /*
             * =================================================
             * INCIDENT TIMELINE
             * =================================================
             */

            sectionTitle(
                "Incident Timeline"
            );


            const timeline =
                Array.isArray(
                    data.timeline
                )
                    ? data.timeline
                    : [];


            if (
                timeline.length === 0
            ) {

                paragraph(
                    "No timeline events available."
                );

            }

            else {

                for (
                    const event
                    of timeline
                ) {

                    addPageIfNeeded(100);


                    doc
                        .font("Helvetica-Bold")
                        .fontSize(10.5)
                        .fillColor(colors.dark)
                        .text(
                            safe(
                                event.time
                            )
                        );


                    doc
                        .font("Helvetica-Bold")
                        .fontSize(11)
                        .fillColor("#000000")
                        .text(
                            safe(
                                event.event ||
                                event.type
                            )
                        );


                    if (
                        event.host
                        ||
                        event.hostname
                    ) {

                        doc
                            .font("Helvetica")
                            .fontSize(10)
                            .text(
                                `Host: ${safe(
                                    event.host ||
                                    event.hostname
                                )}`
                            );

                    }


                    if (
                        event.source
                        ||
                        event.sourceIp
                    ) {

                        doc
                            .font("Helvetica")
                            .fontSize(10)
                            .text(
                                `Source: ${safe(
                                    event.source ||
                                    event.sourceIp
                                )}`
                            );

                    }


                    if (
                        event.destination
                        ||
                        event.destinationIp
                    ) {

                        doc
                            .font("Helvetica")
                            .fontSize(10)
                            .text(
                                `Destination: ${safe(
                                    event.destination ||
                                    event.destinationIp
                                )}`
                            );

                    }


                    paragraph(
                        event.description
                    );


                    doc.moveDown(0.4);


                    doc
                        .strokeColor(
                            colors.border
                        )
                        .moveTo(
                            doc.page.margins.left,
                            doc.y
                        )
                        .lineTo(
                            doc.page.width -
                            doc.page.margins.right,
                            doc.y
                        )
                        .stroke();


                    doc.moveDown(0.6);

                }

            }


            /*
             * =================================================
             * INDICATORS
             * =================================================
             */

            sectionTitle(
                "Indicators of Interest"
            );


            const indicators =
                data.indicators ||
                {};


            writeListSection(
                doc,
                "Source IPs",
                indicators.source_ips,
                bullet
            );


            writeListSection(
                doc,
                "Destination IPs",
                indicators.destination_ips,
                bullet
            );


            writeListSection(
                doc,
                "Usernames",
                indicators.usernames,
                bullet
            );


            writeListSection(
                doc,
                "Hostnames",
                indicators.hostnames,
                bullet
            );


            writeListSection(
                doc,
                "Domains",
                indicators.domains,
                bullet
            );


            writeListSection(
                doc,
                "Ports",
                indicators.ports,
                bullet
            );


            writeListSection(
                doc,
                "Commands",
                indicators.commands,
                bullet
            );


            /*
             * =================================================
             * MITRE ATT&CK
             * =================================================
             */

            sectionTitle(
                "MITRE ATT&CK"
            );


            const mitre =
                Array.isArray(
                    data.mitre
                )
                    ? data.mitre
                    : [];


            if (
                mitre.length === 0
            ) {

                paragraph(
                    "No MITRE ATT&CK mapping available."
                );

            }

            else {

                for (
                    const technique
                    of mitre
                ) {

                    addPageIfNeeded(80);


                    doc
                        .font("Helvetica-Bold")
                        .fontSize(11)
                        .fillColor(colors.dark)
                        .text(
                            `${safe(
                                technique.id
                            )} - ${safe(
                                technique.name
                            )}`
                        );


                    paragraph(
                        technique.reason
                    );

                    doc.moveDown(0.3);

                }

            }


            /*
             * =================================================
             * RISK ASSESSMENT
             * =================================================
             */

            sectionTitle(
                "Risk Assessment"
            );


            const risk =
                data.risk_assessment ||
                {};


            labelValue(
                "Risk Level",
                risk.level
            );


            labelValue(
                "Impact",
                risk.impact
            );


            labelValue(
                "Uncertainties",
                risk.uncertainties
            );


            /*
             * =================================================
             * RECOMMENDATIONS
             * =================================================
             */

            sectionTitle(
                "Recommendations"
            );


            const recommendations =
                Array.isArray(
                    data.recommendations
                )
                    ? data.recommendations
                    : [];


            if (
                recommendations.length === 0
            ) {

                paragraph(
                    "No recommendations available."
                );

            }

            else {

                for (
                    const recommendation
                    of recommendations
                ) {

                    addPageIfNeeded(80);


                    doc
                        .font("Helvetica-Bold")
                        .fontSize(11)
                        .fillColor(
                            getPriorityColor(
                                recommendation.priority
                            )
                        )
                        .text(
                            safe(
                                recommendation.priority,
                                "Normal"
                            )
                        );


                    doc
                        .font("Helvetica-Bold")
                        .fontSize(10.5)
                        .fillColor("#000000")
                        .text(
                            safe(
                                recommendation.action
                            )
                        );


                    paragraph(
                        recommendation.reason
                    );


                    doc.moveDown(0.4);

                }

            }


            /*
             * =================================================
             * CONCLUSION
             * =================================================
             */

            sectionTitle(
                "Conclusion"
            );


            paragraph(
                data.conclusion
            );


            /*
             * =================================================
             * FOOTER ON ALL PAGES
             * =================================================
             */

            const pageRange =
                doc.bufferedPageRange();


            for (
                let i = 0;
                i < pageRange.count;
                i++
            ) {

                doc.switchToPage(
                    pageRange.start + i
                );


                doc
                    .font("Helvetica")
                    .fontSize(8)
                    .fillColor(colors.secondary)
                    .text(
                        `CyberMind AI Incident Report  •  Page ${
                            i + 1
                        }`,
                        50,
                        doc.page.height - 35,
                        {
                            align: "center",
                            width:
                                doc.page.width -
                                100
                        }
                    );

            }


            /*
             * -------------------------------------------------
             * FINISH PDF
             * -------------------------------------------------
             */

            doc.end();

        }

        catch (error) {

            console.error(
                "PDF generation error:",
                error
            );


            if (!res.headersSent) {

                res.status(500).json({

                    success: false,

                    message:
                        error.message

                });

            }

        }

    }

}


/*
 * =============================================================
 * HELPERS
 * =============================================================
 */


function writeListSection(
    doc,
    title,
    values,
    bulletFunction
) {

    doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#172033")
        .text(title);

    doc.moveDown(0.3);


    if (
        !Array.isArray(values)
        ||
        values.length === 0
    ) {

        doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#5f6b7a")
            .text(
                "None observed."
            );

        doc.moveDown(0.6);

        return;

    }


    for (
        const value
        of values
    ) {

        bulletFunction(
            String(value)
        );

    }

}


function getSeverityColor(
    severity
) {

    const value =
        String(
            severity || ""
        ).toLowerCase();


    if (
        value === "critical"
    ) {

        return "#c0392b";

    }


    if (
        value === "high"
    ) {

        return "#e67e22";

    }


    if (
        value === "medium"
    ) {

        return "#2980b9";

    }


    if (
        value === "low"
    ) {

        return "#27ae60";

    }


    return "#5f6b7a";

}


function getPriorityColor(
    priority
) {

    const value =
        String(
            priority || ""
        ).toLowerCase();


    if (
        value === "critical"
    ) {

        return "#c0392b";

    }


    if (
        value === "high"
    ) {

        return "#e67e22";

    }


    if (
        value === "medium"
    ) {

        return "#2980b9";

    }


    if (
        value === "low"
    ) {

        return "#27ae60";

    }


    return "#5f6b7a";

}


module.exports =
    ReportController;