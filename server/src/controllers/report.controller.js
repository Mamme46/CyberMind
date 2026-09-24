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

                accent: "#3a5da8",

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

                doc.moveDown(0.6);

                const barTop = doc.y + 2;

                doc
                    .rect(
                        doc.page.margins.left,
                        barTop,
                        3,
                        14
                    )
                    .fill(colors.accent);

                doc
                    .fontSize(15)
                    .font("Helvetica-Bold")
                    .fillColor(colors.dark)
                    .text(
                        title,
                        doc.page.margins.left + 12,
                        doc.y
                    );

                doc.x = doc.page.margins.left;

                doc
                    .moveDown(0.3)
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


            function severityBadge(
                label,
                color
            ) {

                addPageIfNeeded(40);

                const paddingX = 10;
                const height = 20;

                doc
                    .font("Helvetica-Bold")
                    .fontSize(9);

                const textWidth =
                    doc.widthOfString(
                        label.toUpperCase()
                    );

                const width =
                    textWidth + paddingX * 2;

                const x = doc.page.margins.left;
                const y = doc.y;

                doc
                    .roundedRect(x, y, width, height, 3)
                    .fill(color);

                doc
                    .fillColor("#ffffff")
                    .text(
                        label.toUpperCase(),
                        x,
                        y + 5.5,
                        {
                            width,
                            align: "center"
                        }
                    );

                doc.x = doc.page.margins.left;
                doc.y = y + height + 14;

            }


            function labelValue(
                label,
                value
            ) {

                const boxX =
                    doc.page.margins.left;

                const boxWidth =
                    doc.page.width -
                    doc.page.margins.left -
                    doc.page.margins.right;

                const accentWidth = 3;
                const innerPaddingX = 12;
                const innerPaddingY = 9;

                const contentWidth =
                    boxWidth -
                    accentWidth -
                    innerPaddingX * 2;

                const labelText =
                    label.toUpperCase();

                const valueText =
                    safe(value);

                doc
                    .font("Helvetica-Bold")
                    .fontSize(8.5);

                const labelHeight =
                    doc.heightOfString(
                        labelText,
                        {
                            width: contentWidth,
                            characterSpacing: 0.3
                        }
                    );

                doc
                    .font("Helvetica")
                    .fontSize(10.5);

                const valueHeight =
                    doc.heightOfString(
                        valueText,
                        {
                            width: contentWidth,
                            lineGap: 2
                        }
                    );

                const gap = 4;

                const totalHeight =
                    innerPaddingY * 2 +
                    labelHeight +
                    gap +
                    valueHeight;

                addPageIfNeeded(totalHeight + 10);

                const boxY = doc.y;

                doc
                    .roundedRect(
                        boxX,
                        boxY,
                        boxWidth,
                        totalHeight,
                        4
                    )
                    .fillAndStroke(
                        colors.light,
                        colors.border
                    );

                doc
                    .rect(
                        boxX,
                        boxY,
                        accentWidth,
                        totalHeight
                    )
                    .fill(colors.accent);

                const textX =
                    boxX +
                    accentWidth +
                    innerPaddingX;

                doc
                    .font("Helvetica-Bold")
                    .fontSize(8.5)
                    .fillColor(colors.accent)
                    .text(
                        labelText,
                        textX,
                        boxY + innerPaddingY,
                        {
                            width: contentWidth,
                            characterSpacing: 0.3
                        }
                    );

                doc
                    .font("Helvetica")
                    .fontSize(10.5)
                    .fillColor("#000000")
                    .text(
                        valueText,
                        textX,
                        boxY +
                        innerPaddingY +
                        labelHeight +
                        gap,
                        {
                            width: contentWidth,
                            lineGap: 2
                        }
                    );

                doc.x = boxX;
                doc.y = boxY + totalHeight + 8;

            }


            function chipRow(
                label,
                values
            ) {

                addPageIfNeeded(40);

                doc
                    .font("Helvetica-Bold")
                    .fontSize(9)
                    .fillColor(colors.secondary)
                    .text(
                        label.toUpperCase(),
                        { characterSpacing: 0.3 }
                    );

                doc.moveDown(0.3);

                const safeValues =
                    Array.isArray(values)
                        ? values.filter(Boolean)
                        : [];

                if (safeValues.length === 0) {

                    doc
                        .font("Helvetica")
                        .fontSize(10)
                        .fillColor(colors.secondary)
                        .text("None observed.");

                    doc.x = doc.page.margins.left;
                    doc.moveDown(0.7);

                    return;

                }

                const startX =
                    doc.page.margins.left;

                const maxX =
                    doc.page.width -
                    doc.page.margins.right;

                const chipHeight = 18;
                const paddingX = 8;
                const gap = 6;

                let x = startX;
                let y = doc.y;

                doc.font("Helvetica").fontSize(9);

                for (const value of safeValues) {

                    const text = String(value);

                    const textWidth =
                        doc.widthOfString(text);

                    const chipWidth =
                        textWidth + paddingX * 2;

                    if (x + chipWidth > maxX) {

                        x = startX;
                        y += chipHeight + gap;

                    }

                    if (
                        y + chipHeight >
                        doc.page.height -
                        doc.page.margins.bottom
                    ) {

                        doc.addPage();
                        y = doc.page.margins.top;
                        x = startX;

                    }

                    doc
                        .roundedRect(
                            x,
                            y,
                            chipWidth,
                            chipHeight,
                            3
                        )
                        .fillAndStroke(
                            colors.light,
                            colors.border
                        );

                    doc
                        .fillColor(colors.dark)
                        .text(
                            text,
                            x + paddingX,
                            y + 4.5,
                            {
                                width: textWidth,
                                lineBreak: false
                            }
                        );

                    x += chipWidth + gap;

                }

                doc.x = startX;
                doc.y = y + chipHeight + 16;

            }


            function timelineEvent(
                event
            ) {

                const boxX =
                    doc.page.margins.left;

                const boxWidth =
                    doc.page.width -
                    doc.page.margins.left -
                    doc.page.margins.right;

                const innerPaddingX = 12;

                const contentWidth =
                    boxWidth -
                    innerPaddingX * 2;

                const timeText =
                    safe(event.time);

                const typeText =
                    safe(
                        event.event ||
                        event.type
                    );

                const metaParts = [];

                if (
                    event.host ||
                    event.hostname
                ) {

                    metaParts.push(
                        `Host: ${safe(
                            event.host ||
                            event.hostname
                        )}`
                    );

                }

                if (
                    event.source ||
                    event.sourceIp
                ) {

                    metaParts.push(
                        `Source: ${safe(
                            event.source ||
                            event.sourceIp
                        )}`
                    );

                }

                if (
                    event.destination ||
                    event.destinationIp
                ) {

                    metaParts.push(
                        `Destination: ${safe(
                            event.destination ||
                            event.destinationIp
                        )}`
                    );

                }

                const metaText =
                    metaParts.join("    •    ");

                const descText =
                    event.description
                        ? safe(event.description)
                        : "";

                doc.font("Helvetica-Bold").fontSize(10);

                const timeHeight =
                    doc.heightOfString(
                        timeText,
                        { width: contentWidth }
                    );

                doc.font("Helvetica-Bold").fontSize(11);

                const typeHeight =
                    doc.heightOfString(
                        typeText,
                        { width: contentWidth }
                    );

                doc.font("Helvetica").fontSize(9.5);

                const metaHeight =
                    metaParts.length
                        ? doc.heightOfString(
                            metaText,
                            { width: contentWidth }
                        )
                        : 0;

                doc.font("Helvetica").fontSize(10);

                const descHeight =
                    descText
                        ? doc.heightOfString(
                            descText,
                            {
                                width: contentWidth,
                                lineGap: 2
                            }
                        )
                        : 0;

                const paddingY = 12;
                const gapBetween = 5;

                const totalHeight =
                    paddingY * 2 +
                    timeHeight +
                    gapBetween +
                    typeHeight +
                    (
                        metaParts.length
                            ? gapBetween + metaHeight
                            : 0
                    ) +
                    (
                        descText
                            ? gapBetween + descHeight
                            : 0
                    );

                addPageIfNeeded(totalHeight + 16);

                const boxY = doc.y;

                doc
                    .roundedRect(
                        boxX,
                        boxY,
                        boxWidth,
                        totalHeight,
                        4
                    )
                    .fillAndStroke(
                        colors.light,
                        colors.border
                    );

                let cursorY =
                    boxY + paddingY;

                const textX =
                    boxX + innerPaddingX;

                doc
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .fillColor(colors.accent)
                    .text(
                        timeText,
                        textX,
                        cursorY,
                        { width: contentWidth }
                    );

                cursorY += timeHeight + gapBetween;

                doc
                    .font("Helvetica-Bold")
                    .fontSize(11)
                    .fillColor("#000000")
                    .text(
                        typeText,
                        textX,
                        cursorY,
                        { width: contentWidth }
                    );

                cursorY += typeHeight + gapBetween;

                if (metaParts.length) {

                    doc
                        .font("Helvetica")
                        .fontSize(9.5)
                        .fillColor(colors.secondary)
                        .text(
                            metaText,
                            textX,
                            cursorY,
                            { width: contentWidth }
                        );

                    cursorY += metaHeight + gapBetween;

                }

                if (descText) {

                    doc
                        .font("Helvetica")
                        .fontSize(10)
                        .fillColor("#000000")
                        .text(
                            descText,
                            textX,
                            cursorY,
                            {
                                width: contentWidth,
                                lineGap: 2
                            }
                        );

                }

                doc.x = boxX;
                doc.y = boxY + totalHeight + 12;

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

            const bandHeight = 64;

            doc
                .rect(0, 0, doc.page.width, bandHeight)
                .fill(colors.dark);

            doc
                .font("Helvetica-Bold")
                .fontSize(16)
                .fillColor("#ffffff")
                .text(
                    "Security Incident Report",
                    0,
                    bandHeight / 2 - 8,
                    {
                        align: "center",
                        width: doc.page.width
                    }
                );

            doc.x = doc.page.margins.left;
            doc.y = bandHeight + 26;


            doc
                .font("Helvetica-Bold")
                .fontSize(19)
                .fillColor("#000000")
                .text(
                    safe(report.title)
                );

            doc.x = doc.page.margins.left;

            doc.moveDown(0.8);


            /*
             * -------------------------------------------------
             * SEVERITY
             * -------------------------------------------------
             */

            const severity =
                data.assessment?.severity ||
                "Unknown";

            severityBadge(
                `Severity: ${severity}`,
                getSeverityColor(severity)
            );


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


            chipRow(
                "Hosts",
                evidence.hosts
            );


            chipRow(
                "Users",
                evidence.users
            );


            chipRow(
                "Source IPs",
                evidence.source_ips
            );


            chipRow(
                "Destination IPs",
                evidence.destination_ips
            );


            if (
                Array.isArray(
                    evidence.commands
                ) &&
                evidence.commands.length > 0
            ) {

                addPageIfNeeded(60);

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

                    timelineEvent(event);

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


            chipRow(
                "Source IPs",
                indicators.source_ips
            );


            chipRow(
                "Destination IPs",
                indicators.destination_ips
            );


            chipRow(
                "Usernames",
                indicators.usernames
            );


            chipRow(
                "Hostnames",
                indicators.hostnames
            );


            chipRow(
                "Domains",
                indicators.domains
            );


            chipRow(
                "Ports",
                indicators.ports
            );


            chipRow(
                "Commands",
                indicators.commands
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

            const originalBottomMargin =
                doc.page.margins.bottom;


            for (
                let i = 0;
                i < pageRange.count;
                i++
            ) {

                doc.switchToPage(
                    pageRange.start + i
                );

                /*
                 * The footer is drawn inside the bottom
                 * margin, which would otherwise make PDFKit
                 * think the content overflows and silently
                 * insert an extra blank page per page.
                 */

                doc.page.margins.bottom = 0;

                doc
                    .font("Helvetica")
                    .fontSize(8)
                    .fillColor(colors.secondary)
                    .text(
                        `Page ${
                            i + 1
                        } of ${pageRange.count}`,
                        50,
                        doc.page.height - 35,
                        {
                            align: "center",
                            width:
                                doc.page.width -
                                100,
                            lineBreak: false
                        }
                    );

                doc.page.margins.bottom =
                    originalBottomMargin;

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