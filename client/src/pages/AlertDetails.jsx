import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Layout from "../components/layout/Layout";

import { getInvestigation } from "../api/investigation.api";

import { generateReport } from "../api/ai.api";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import SecurityIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import TerminalIcon from "@mui/icons-material/Terminal";
import ComputerIcon from "@mui/icons-material/Computer";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
    Typography,
    Paper,
    Button,
    Box,
    Chip,
    Divider,
    Card,
    CardContent,
    CircularProgress,
    Alert as MuiAlert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";


function AlertDetails() {

    const { id } = useParams();


    const [investigation, setInvestigation] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [report, setReport] =
        useState(null);

    const [loadingReport, setLoadingReport] =
        useState(false);

    const [reportError, setReportError] =
        useState("");


    /*
     * =========================================================
     * LOAD INVESTIGATION
     * =========================================================
     */

    useEffect(() => {

        async function loadInvestigation() {

            try {

                setLoading(true);

                const data =
                    await getInvestigation(id);

                setInvestigation(data);

            }

            catch (err) {

                console.error(
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load investigation."
                );

            }

            finally {

                setLoading(false);

            }

        }


        loadInvestigation();

    }, [id]);


    /*
     * =========================================================
     * GENERATE AI REPORT
     * =========================================================
     */

    async function handleGenerateReport() {

        try {

            setLoadingReport(true);

            setReportError("");

            const aiReport =
                await generateReport(id);


            /*
             * The new backend returns a structured JSON
             * object.
             *
             * We also keep compatibility with a stringified
             * JSON response.
             */

            let parsedReport =
                aiReport;


            if (
                typeof aiReport === "string"
            ) {

                try {

                    parsedReport =
                        JSON.parse(
                            aiReport
                        );

                }

                catch (parseError) {

                    console.error(
                        "Invalid AI report:",
                        parseError
                    );

                    throw new Error(
                        "The AI returned an invalid report."
                    );

                }

            }


            if (
                !parsedReport ||
                typeof parsedReport !== "object"
            ) {

                throw new Error(
                    "The AI returned an invalid report."
                );

            }


            setReport(
                parsedReport
            );

        }

        catch (err) {

            console.error(
                "AI report generation failed:",
                err
            );

            setReportError(
                err.response?.data?.message ||
                err.message ||
                "Failed to generate AI report."
            );

        }

        finally {

            setLoadingReport(false);

        }

    }


    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (loading) {

        return (

            <Layout>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 10
                    }}
                >

                    <CircularProgress />

                </Box>

            </Layout>

        );

    }


    /*
     * =========================================================
     * ERROR
     * =========================================================
     */

    if (error) {

        return (

            <Layout>

                <MuiAlert severity="error">

                    {error}

                </MuiAlert>

            </Layout>

        );

    }


    if (!investigation) {

        return null;

    }


    const alert =
        investigation.alert;

    const summary =
        investigation.summary || {};

    const timeline =
        investigation.timeline || [];


    /*
     * =========================================================
     * REPORT DATA
     * =========================================================
     */

    const assessment =
        report?.assessment || {};

    const technicalAnalysis =
        report?.technical_analysis || {};

    const riskAssessment =
        report?.risk_assessment || {};

    const evidence =
        report?.evidence || {};

    const indicators =
        report?.indicators || {};

    const mitre =
        Array.isArray(report?.mitre)
            ? report.mitre
            : [];

    const recommendations =
        Array.isArray(
            report?.recommendations
        )
            ? report.recommendations
            : [];

    const conclusion =
        report?.conclusion || "";


    return (

        <Layout>


            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <Typography
                variant="h4"
                mb={3}
                fontWeight="bold"
            >

                Alert Investigation

            </Typography>


            {/* =================================================
                ALERT INFORMATION
            ================================================= */}

            <Paper
                sx={{
                    p: 4,
                    mb: 3,
                    borderRadius: 3
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >

                        {alert.title}

                    </Typography>


                    <Chip
                        label={
                            alert.severity
                        }
                        color={
                            alert.severity ===
                            "critical"

                                ? "error"

                                : alert.severity ===
                                  "high"

                                    ? "warning"

                                    : "info"
                        }
                    />

                </Box>


                <Divider
                    sx={{
                        my: 3
                    }}
                />


                <InfoRow
                    label="Alert ID"
                    value={
                        alert.id
                    }
                />

                <InfoRow
                    label="Upload ID"
                    value={
                        alert.upload_id
                    }
                />

                <InfoRow
                    label="Description"
                    value={
                        alert.description
                    }
                />

                <InfoRow
                    label="Source IP"
                    value={
                        alert.source_ip ||
                        "-"
                    }
                />

                <InfoRow
                    label="Username"
                    value={
                        alert.username ||
                        "-"
                    }
                />

                <InfoRow
                    label="Status"
                    value={
                        alert.status
                    }
                />

                <InfoRow
                    label="Created"
                    value={
                        formatDate(
                            alert.created_at
                        )
                    }
                />


                <Box
                    sx={{
                        mt: 4,
                        display: "flex",
                        justifyContent: "flex-end"
                    }}
                >

                    <Button
                        variant="contained"
                        startIcon={
                            <AutoAwesomeIcon />
                        }
                        onClick={
                            handleGenerateReport
                        }
                        disabled={
                            loadingReport
                        }
                    >

                        {
                            loadingReport
                                ? "Generating..."
                                : "Generate AI Report"
                        }

                    </Button>

                </Box>

            </Paper>


            {/* =================================================
                INVESTIGATION SUMMARY
            ================================================= */}

            <Typography
                variant="h5"
                mb={2}
                fontWeight="bold"
            >

                Investigation Summary

            </Typography>


            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(3, 1fr)"
                    },
                    gap: 2,
                    mb: 4
                }}
            >

                <SummaryCard
                    title="Total Events"
                    value={
                        summary.totalEvents ?? 0
                    }
                />

                <SummaryCard
                    title="Failed Logins"
                    value={
                        summary.failedLogins ?? 0
                    }
                />

                <SummaryCard
                    title="Successful Logins"
                    value={
                        summary.successfulLogins ?? 0
                    }
                />

            </Box>


            {/* =================================================
                SOURCE IPS
            ================================================= */}

            <Paper
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="h6"
                    mb={2}
                    fontWeight="bold"
                >

                    Source IPs

                </Typography>


                {
                    summary.sourceIPs?.length > 0

                        ?

                        summary.sourceIPs.map(
                            ip => (

                                <Chip
                                    key={ip}
                                    label={ip}
                                    sx={{
                                        mr: 1,
                                        mb: 1
                                    }}
                                />

                            )
                        )

                        :

                        <Typography
                            color="text.secondary"
                        >

                            No source IP detected.

                        </Typography>
                }

            </Paper>


            {/* =================================================
                INVESTIGATION TIMELINE
            ================================================= */}

            <Typography
                variant="h5"
                mb={2}
                fontWeight="bold"
            >

                Investigation Timeline

            </Typography>


            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    mb: 4
                }}
            >

                {
                    Array.isArray(timeline) &&
                    timeline.length > 0

                        ?

                        timeline.map(
                            (
                                event,
                                index
                            ) => (

                                <Box
                                    key={
                                        event.eventId ??
                                        event.id ??
                                        index
                                    }
                                    sx={{
                                        mb: 2,
                                        pb: 2,
                                        borderBottom:
                                            "1px solid #ddd"
                                    }}
                                >

                                    <Typography
                                        fontWeight="bold"
                                    >

                                        {
                                            event.event_type ||
                                            event.type ||
                                            "Event"
                                        }

                                    </Typography>


                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            mb: 1
                                        }}
                                    >

                                        {
                                            formatDate(
                                                event.time ||
                                                event.event_time
                                            )
                                        }

                                    </Typography>


                                    <Typography>

                                        {
                                            event.message ||
                                            event.description ||
                                            event.raw_log ||
                                            "-"
                                        }

                                    </Typography>


                                    {
                                        event.source_ip && (

                                            <Typography
                                                color="text.secondary"
                                            >

                                                Source IP:{" "}
                                                {
                                                    event.source_ip
                                                }

                                            </Typography>

                                        )
                                    }

                                </Box>

                            )
                        )

                        :

                        <Typography
                            color="text.secondary"
                        >

                            No timeline events available.

                        </Typography>
                }

            </Paper>


            {/* =================================================
                AI REPORT ERROR
            ================================================= */}

            {
                reportError && (

                    <MuiAlert
                        severity="error"
                        sx={{
                            mb: 3
                        }}
                    >

                        {reportError}

                    </MuiAlert>

                )
            }


            {/* =================================================
                AI REPORT LOADING
            ================================================= */}

            {
                loadingReport && (

                    <Paper
                        sx={{
                            mt: 4,
                            p: 5,
                            borderRadius: 4
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2
                            }}
                        >

                            <CircularProgress />

                            <Typography
                                color="text.secondary"
                            >

                                CyberMind AI is analyzing
                                the incident...

                            </Typography>

                        </Box>

                    </Paper>

                )
            }


            {/* =================================================
                AI REPORT
            ================================================= */}

            {
                report && !loadingReport && (

                    <AIReport
                        report={report}
                    />

                )
            }


        </Layout>

    );

}


/*
 * =============================================================
 * AI REPORT
 * =============================================================
 */

function AIReport({
    report
}) {

    const assessment =
        report.assessment || {};

    const technical =
        report.technical_analysis || {};

    const risk =
        report.risk_assessment || {};

    const evidence =
        report.evidence || {};

    const indicators =
        report.indicators || {};

    const timeline =
        Array.isArray(report.timeline)
            ? report.timeline
            : [];

    const mitre =
        Array.isArray(report.mitre)
            ? report.mitre
            : [];

    const recommendations =
        Array.isArray(
            report.recommendations
        )
            ? report.recommendations
            : [];


    return (

        <Box
            sx={{
                mt: 5,
                mb: 5
            }}
        >


            {/* =================================================
                REPORT HEADER
            ================================================= */}

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    mb: 3,
                    background:
                        "linear-gradient(135deg, #10182f 0%, #1d2b55 100%)",
                    color: "white"
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2
                    }}
                >

                    <SecurityIcon />

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >

                        AI Incident Report

                    </Typography>

                </Box>


                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                        mb: 2
                    }}
                >

                    {
                        assessment.attack_type ||
                        "Security Incident"
                    }

                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap"
                    }}
                >

                    <Chip
                        label={
                            (
                                assessment.severity ||
                                "unknown"
                            ).toUpperCase()
                        }
                        color={
                            getSeverityColor(
                                assessment.severity
                            )
                        }
                    />

                    <Chip
                        label={
                            `Confidence: ${
                                assessment.confidence ||
                                "Unknown"
                            }`
                        }
                        sx={{
                            color: "white",
                            borderColor:
                                "rgba(255,255,255,0.4)"
                        }
                        }
                        variant="outlined"
                    />

                </Box>

            </Paper>


            {/* =================================================
                EXECUTIVE ASSESSMENT
            ================================================= */}

            <ReportSection
                title="Executive Assessment"
                icon={
                    <SecurityIcon />
                }
            >

                <Typography
                    sx={{
                        lineHeight: 1.8,
                        mb: 3
                    }}
                >

                    {
                        assessment.summary ||
                        "No assessment available."
                    }

                </Typography>


                <InfoGrid>

                    <InfoBox
                        label="Attack Type"
                        value={
                            assessment.attack_type ||
                            "-"
                        }
                    />

                    <InfoBox
                        label="Severity"
                        value={
                            assessment.severity ||
                            "-"
                        }
                    />

                    <InfoBox
                        label="Confidence"
                        value={
                            assessment.confidence ||
                            "-"
                        }
                    />

                    <InfoBox
                        label="Potential Impact"
                        value={
                            assessment.impact ||
                            "-"
                        }
                    />

                </InfoGrid>

            </ReportSection>


            {/* =================================================
                TECHNICAL ANALYSIS
            ================================================= */}

            <ReportSection
                title="Technical Analysis"
                icon={
                    <TerminalIcon />
                }
            >

                <AnalysisBlock
                    title="What happened"
                    value={
                        technical.what_happened
                    }
                />

                <AnalysisBlock
                    title="Why was the alert triggered?"
                    value={
                        technical.detection_reason
                    }
                />

                <AnalysisBlock
                    title="Evidence analysis"
                    value={
                        technical.evidence_analysis
                    }
                />

                <AnalysisBlock
                    title="Affected entities"
                    value={
                        technical.affected_entities
                    }
                />

            </ReportSection>


            {/* =================================================
                EVIDENCE
            ================================================= */}

            <ReportSection
                title="Observed Evidence"
                icon={
                    <WarningIcon />
                }
            >

                <InfoGrid>

                    <EvidenceCard
                        icon={
                            <ComputerIcon />
                        }
                        title="Hosts"
                        values={
                            evidence.hosts
                        }
                    />

                    <EvidenceCard
                        icon={
                            <PersonIcon />
                        }
                        title="Users"
                        values={
                            evidence.users
                        }
                    />

                    <EvidenceCard
                        icon={
                            <PublicIcon />
                        }
                        title="Source IPs"
                        values={
                            evidence.source_ips
                        }
                    />

                    <EvidenceCard
                        icon={
                            <PublicIcon />
                        }
                        title="Destination IPs"
                        values={
                            evidence.destination_ips
                        }
                    />

                </InfoGrid>


                {
                    evidence.commands?.length > 0 && (

                        <Box sx={{ mt: 3 }}>

                            <Typography
                                fontWeight="bold"
                                mb={1}
                            >

                                Observed Commands

                            </Typography>


                            {
                                evidence.commands.map(
                                    (
                                        command,
                                        index
                                    ) => (

                                        <Paper
                                            key={index}
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                mb: 1,
                                                background:
                                                    "#f7f7f7",
                                                fontFamily:
                                                    "monospace",
                                                overflowX:
                                                    "auto"
                                            }}
                                        >

                                            {command}

                                        </Paper>

                                    )
                                )
                            }

                        </Box>

                    )
                }

            </ReportSection>


            {/* =================================================
                TIMELINE
            ================================================= */}

            <ReportSection
                title="Incident Timeline"
            >

                {
                    timeline.length === 0

                        ?

                        <Typography
                            color="text.secondary"
                        >

                            No timeline events available.

                        </Typography>

                        :

                        <TableContainer>

                            <Table>

                                <TableHead>

                                    <TableRow>

                                        <TableCell>
                                            Time
                                        </TableCell>

                                        <TableCell>
                                            Event
                                        </TableCell>

                                        <TableCell>
                                            Host
                                        </TableCell>

                                        <TableCell>
                                            Source
                                        </TableCell>

                                        <TableCell>
                                            Destination
                                        </TableCell>

                                        <TableCell>
                                            Description
                                        </TableCell>

                                    </TableRow>

                                </TableHead>


                                <TableBody>

                                    {
                                        timeline.map(
                                            (
                                                event,
                                                index
                                            ) => (

                                                <TableRow
                                                    key={
                                                        event.eventId ||
                                                        index
                                                    }
                                                >

                                                    <TableCell
                                                        sx={{
                                                            whiteSpace:
                                                                "nowrap"
                                                        }}
                                                    >

                                                        {
                                                            formatDate(
                                                                event.time
                                                            )
                                                        }

                                                    </TableCell>


                                                    <TableCell>

                                                        <Chip
                                                            size="small"
                                                            label={
                                                                event.type ||
                                                                "-"
                                                            }
                                                        />

                                                    </TableCell>


                                                    <TableCell>

                                                        {
                                                            event.hostname ||
                                                            "-"
                                                        }

                                                    </TableCell>


                                                    <TableCell>

                                                        {
                                                            event.sourceIp ||
                                                            "-"
                                                        }

                                                    </TableCell>


                                                    <TableCell>

                                                        {
                                                            event.destinationIp
                                                                ? `${event.destinationIp}${
                                                                    event.destinationPort
                                                                        ? `:${event.destinationPort}`
                                                                        : ""
                                                                }`
                                                                : "-"
                                                        }

                                                    </TableCell>


                                                    <TableCell>

                                                        {
                                                            event.description ||
                                                            "-"
                                                        }

                                                    </TableCell>

                                                </TableRow>

                                            )
                                        )
                                    }

                                </TableBody>

                            </Table>

                        </TableContainer>

                }

            </ReportSection>


            {/* =================================================
                INDICATORS
            ================================================= */}

            <ReportSection
                title="Indicators of Interest"
            >

                <IndicatorList
                    title="Source IPs"
                    values={
                        indicators.source_ips
                    }
                />

                <IndicatorList
                    title="Destination IPs"
                    values={
                        indicators.destination_ips
                    }
                />

                <IndicatorList
                    title="Usernames"
                    values={
                        indicators.usernames
                    }
                />

                <IndicatorList
                    title="Hostnames"
                    values={
                        indicators.hostnames
                    }
                />

                <IndicatorList
                    title="Domains"
                    values={
                        indicators.domains
                    }
                />

                <IndicatorList
                    title="Ports"
                    values={
                        indicators.ports
                    }
                />

                <IndicatorList
                    title="Commands"
                    values={
                        indicators.commands
                    }
                />

            </ReportSection>


            {/* =================================================
                MITRE ATT&CK
            ================================================= */}

            <ReportSection
                title="MITRE ATT&CK"
            >

                {
                    mitre.length === 0

                        ?

                        <Typography
                            color="text.secondary"
                        >

                            No MITRE ATT&CK mapping
                            available.

                        </Typography>

                        :

                        mitre.map(
                            (
                                technique,
                                index
                            ) => (

                                <Accordion
                                    key={
                                        `${technique.id}-${index}`
                                    }
                                >

                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMoreIcon />
                                        }
                                    >

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap: 2
                                            }}
                                        >

                                            <Chip
                                                label={
                                                    technique.id ||
                                                    "N/A"
                                                }
                                                size="small"
                                            />

                                            <Typography
                                                fontWeight="bold"
                                            >

                                                {
                                                    technique.name ||
                                                    "Unknown technique"
                                                }

                                            </Typography>

                                        </Box>

                                    </AccordionSummary>


                                    <AccordionDetails>

                                        <Typography
                                            color="text.secondary"
                                        >

                                            {
                                                technique.reason ||
                                                "No explanation available."
                                            }

                                        </Typography>

                                    </AccordionDetails>

                                </Accordion>

                            )
                        )

                }

            </ReportSection>


            {/* =================================================
                RISK ASSESSMENT
            ================================================= */}

            <ReportSection
                title="Risk Assessment"
                icon={
                    <WarningIcon />
                }
            >

                <InfoGrid>

                    <InfoBox
                        label="Risk Level"
                        value={
                            risk.level ||
                            "-"
                        }
                    />

                    <InfoBox
                        label="Potential Impact"
                        value={
                            risk.impact ||
                            "-"
                        }
                    />

                </InfoGrid>


                <AnalysisBlock
                    title="Uncertainties"
                    value={
                        risk.uncertainties
                    }
                />

            </ReportSection>


            {/* =================================================
                RECOMMENDATIONS
            ================================================= */}

            <ReportSection
                title="Recommendations"
            >

                {
                    recommendations.length === 0

                        ?

                        <Typography
                            color="text.secondary"
                        >

                            No recommendations available.

                        </Typography>

                        :

                        recommendations.map(
                            (
                                recommendation,
                                index
                            ) => (

                                <Paper
                                    key={index}
                                    variant="outlined"
                                    sx={{
                                        p: 2.5,
                                        mb: 2,
                                        borderRadius: 2
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: 1,
                                            mb: 1
                                        }}
                                    >

                                        <Chip
                                            size="small"
                                            label={
                                                recommendation.priority ||
                                                "Normal"
                                            }
                                            color={
                                                getPriorityColor(
                                                    recommendation.priority
                                                )
                                            }
                                        />

                                        <Typography
                                            fontWeight="bold"
                                        >

                                            {
                                                recommendation.action
                                            }

                                        </Typography>

                                    </Box>


                                    <Typography
                                        color="text.secondary"
                                    >

                                        {
                                            recommendation.reason ||
                                            ""
                                        }

                                    </Typography>

                                </Paper>

                            )
                        )

                }

            </ReportSection>


            {/* =================================================
                CONCLUSION
            ================================================= */}

            <ReportSection
                title="Conclusion"
            >

                <Typography
                    sx={{
                        lineHeight: 1.8
                    }}
                >

                    {
                        report.conclusion ||
                        "No conclusion available."
                    }

                </Typography>

            </ReportSection>


        </Box>

    );

}


/*
 * =============================================================
 * REPORT SECTION
 * =============================================================
 */

function ReportSection({
    title,
    icon,
    children
}) {

    return (

        <Paper
            sx={{
                p: 4,
                mb: 3,
                borderRadius: 4
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2
                }}
            >

                {icon}

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >

                    {title}

                </Typography>

            </Box>


            <Divider
                sx={{
                    mb: 3
                }}
            />


            {children}

        </Paper>

    );

}


/*
 * =============================================================
 * ANALYSIS BLOCK
 * =============================================================
 */

function AnalysisBlock({
    title,
    value
}) {

    if (!value) {

        return null;

    }

    return (

        <Box
            sx={{
                mb: 3
            }}
        >

            <Typography
                fontWeight="bold"
                sx={{
                    mb: 1
                }}
            >

                {title}

            </Typography>


            <Typography
                color="text.secondary"
                sx={{
                    lineHeight: 1.8
                }}
            >

                {value}

            </Typography>

        </Box>

    );

}


/*
 * =============================================================
 * INFO GRID
 * =============================================================
 */

function InfoGrid({
    children
}) {

    return (

        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, 1fr)"
                },
                gap: 2
            }}
        >

            {children}

        </Box>

    );

}


/*
 * =============================================================
 * INFO BOX
 * =============================================================
 */

function InfoBox({
    label,
    value
}) {

    return (

        <Box
            sx={{
                border: "1px solid",
                borderColor:
                    "divider",
                borderRadius: 2,
                p: 2
            }}
        >

            <Typography
                variant="caption"
                color="text.secondary"
            >

                {label}

            </Typography>


            <Typography
                fontWeight="bold"
                sx={{
                    mt: 0.5
                }}
            >

                {value || "-"}

            </Typography>

        </Box>

    );

}


/*
 * =============================================================
 * EVIDENCE CARD
 * =============================================================
 */

function EvidenceCard({
    icon,
    title,
    values
}) {

    const safeValues =
        Array.isArray(values)
            ? values
            : [];


    return (

        <Card>

            <CardContent>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2
                    }}
                >

                    {icon}

                    <Typography
                        fontWeight="bold"
                    >

                        {title}

                    </Typography>

                </Box>


                {
                    safeValues.length === 0

                        ?

                        <Typography
                            color="text.secondary"
                        >

                            None observed.

                        </Typography>

                        :

                        <Box>

                            {
                                safeValues.map(
                                    (
                                        value,
                                        index
                                    ) => (

                                        <Chip
                                            key={index}
                                            label={
                                                String(value)
                                            }
                                            size="small"
                                            sx={{
                                                mr: 0.5,
                                                mb: 0.5
                                            }}
                                        />

                                    )
                                )
                            }

                        </Box>
                }

            </CardContent>

        </Card>

    );

}


/*
 * =============================================================
 * INDICATOR LIST
 * =============================================================
 */

function IndicatorList({
    title,
    values
}) {

    const safeValues =
        Array.isArray(values)
            ? values
            : [];


    return (

        <Box
            sx={{
                mb: 3
            }}
        >

            <Typography
                fontWeight="bold"
                mb={1}
            >

                {title}

            </Typography>


            {
                safeValues.length === 0

                    ?

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        None observed.

                    </Typography>

                    :

                    <Box>

                        {
                            safeValues.map(
                                (
                                    value,
                                    index
                                ) => (

                                    <Chip
                                        key={index}
                                        label={
                                            String(value)
                                        }
                                        size="small"
                                        sx={{
                                            mr: 0.5,
                                            mb: 0.5
                                        }}
                                    />

                                )
                            )
                        }

                    </Box>
            }

        </Box>

    );

}


/*
 * =============================================================
 * SUMMARY CARD
 * =============================================================
 */

function SummaryCard({
    title,
    value
}) {

    return (

        <Card>

            <CardContent>

                <Typography
                    color="text.secondary"
                >

                    {title}

                </Typography>


                <Typography
                    variant="h4"
                    fontWeight="bold"
                >

                    {value}

                </Typography>

            </CardContent>

        </Card>

    );

}


/*
 * =============================================================
 * INFO ROW
 * =============================================================
 */

function InfoRow({
    label,
    value
}) {

    return (

        <Typography
            sx={{
                mb: 1
            }}
        >

            <strong>
                {label}:
            </strong>{" "}

            {value || "-"}

        </Typography>

    );

}


/*
 * =============================================================
 * DATE
 * =============================================================
 */

function formatDate(
    value
) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleString();

}


/*
 * =============================================================
 * SEVERITY COLOR
 * =============================================================
 */

function getSeverityColor(
    severity
) {

    const value =
        String(
            severity ||
            ""
        ).toLowerCase();


    if (
        value === "critical"
    ) {

        return "error";

    }


    if (
        value === "high"
    ) {

        return "warning";

    }


    if (
        value === "medium"
    ) {

        return "info";

    }


    if (
        value === "low"
    ) {

        return "success";

    }


    return "default";

}


/*
 * =============================================================
 * PRIORITY COLOR
 * =============================================================
 */

function getPriorityColor(
    priority
) {

    const value =
        String(
            priority ||
            ""
        ).toLowerCase();


    if (
        value === "critical"
    ) {

        return "error";

    }


    if (
        value === "high"
    ) {

        return "warning";

    }


    if (
        value === "medium"
    ) {

        return "info";

    }


    return "default";

}


export default AlertDetails;