import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import Layout from "../components/layout/Layout";

import {
    getReport,
    deleteReport,
    downloadReport
} from "../api/reports.api";

import {
    Paper,
    Typography,
    Button,
    CircularProgress,
    Box,
    Chip,
    Divider,
    Alert,
    List,
    ListItem,
    ListItemText,
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

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SecurityIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import ComputerIcon from "@mui/icons-material/Computer";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import TerminalIcon from "@mui/icons-material/Terminal";


function ReportDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [report, setReport] = useState(null);

    const [reportContent, setReportContent] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    /*
     * =========================================================
     * LOAD REPORT
     * =========================================================
     */

    useEffect(() => {

        loadReport();

    }, [id]);


    async function loadReport() {

        try {

            setLoading(true);

            const data =
                await getReport(id);

            setReport(data);


            /*
             * The backend stores the structured report
             * as JSON text.
             */

            let parsedContent;

            try {

                parsedContent =
                    typeof data.content === "string"

                        ? JSON.parse(data.content)

                        : data.content;

            }

            catch (parseError) {

                /*
                 * Keep the original content if the report
                 * was generated with the old format.
                 */

                parsedContent = {

                    legacy: true,

                    content:
                        data.content

                };

            }


            setReportContent(
                parsedContent
            );

        }

        catch (err) {

            console.error(
                "Failed to load report:",
                err
            );

            setError(
                "Unable to load this report."
            );

        }

        finally {

            setLoading(false);

        }

    }


    /*
     * =========================================================
     * DOWNLOAD
     * =========================================================
     */

    async function handleDownload() {

        try {

            const blob =
                await downloadReport(id);

            const url =
                window.URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement(
                    "a"
                );

            link.href = url;

            link.download =
                `CyberMind_Report_${id}.pdf`;

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            window.URL.revokeObjectURL(
                url
            );

        }

        catch (err) {

            console.error(
                "Failed to download report:",
                err
            );

        }

    }


    /*
     * =========================================================
     * DELETE
     * =========================================================
     */

    async function handleDelete() {

        try {

            await deleteReport(id);

            navigate("/reports");

        }

        catch (err) {

            console.error(
                "Failed to delete report:",
                err
            );

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
                        alignItems: "center",
                        minHeight: "60vh"
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

    if (error || !report) {

        return (

            <Layout>

                <Box sx={{ mt: 4 }}>

                    <Alert severity="error">

                        {error ||
                            "Report not found."}

                    </Alert>

                    <Button
                        sx={{ mt: 3 }}
                        startIcon={
                            <ArrowBackIcon />
                        }
                        onClick={() =>
                            navigate("/reports")
                        }
                    >

                        Back to reports

                    </Button>

                </Box>

            </Layout>

        );

    }


    /*
     * =========================================================
     * LEGACY REPORT
     * =========================================================
     *
     * Reports generated before the new structured format
     * can still be displayed instead of breaking the page.
     */

    if (
        reportContent?.legacy
    ) {

        return (

            <Layout>

                <ReportHeader
                    report={report}
                    onBack={() =>
                        navigate("/reports")
                    }
                />

                <Paper
                    sx={{
                        p: 5,
                        borderRadius: 4,
                        whiteSpace: "pre-wrap"
                    }}
                >

                    <Typography
                        component="pre"
                        sx={{
                            whiteSpace: "pre-wrap",
                            fontFamily:
                                "inherit",
                            lineHeight: 1.7
                        }}
                    >

                        {
                            reportContent.content
                        }

                    </Typography>

                </Paper>

                <ReportActions
                    onDownload={
                        handleDownload
                    }
                    onDelete={
                        handleDelete
                    }
                />

            </Layout>

        );

    }


    /*
     * =========================================================
     * STRUCTURED REPORT
     * =========================================================
     */

    const assessment =
        reportContent?.assessment || {};

    const technical =
        reportContent?.technical_analysis || {};

    const risk =
        reportContent?.risk_assessment || {};

    const evidence =
        reportContent?.evidence || {};

    const timeline =
        Array.isArray(
            reportContent?.timeline
        )
            ? reportContent.timeline
            : [];

    const indicators =
        reportContent?.indicators || {};

    const mitre =
        Array.isArray(
            reportContent?.mitre
        )
            ? reportContent.mitre
            : [];

    const recommendations =
        Array.isArray(
            reportContent?.recommendations
        )
            ? reportContent.recommendations
            : [];

    const conclusion =
        reportContent?.conclusion || "";


    /*
     * =========================================================
     * SEVERITY
     * =========================================================
     */

    const severity =
        String(
            assessment.severity ||
            report.severity ||
            "unknown"
        ).toLowerCase();


    function severityColor() {

        if (
            severity === "critical"
        ) {

            return "error";

        }

        if (
            severity === "high"
        ) {

            return "warning";

        }

        if (
            severity === "medium"
        ) {

            return "info";

        }

        if (
            severity === "low"
        ) {

            return "success";

        }

        return "default";

    }


    return (

        <Layout>

            {/* =================================================
                HEADER
            ================================================= */}

            <ReportHeader
                report={report}
                severity={severity}
                severityColor={
                    severityColor()
                }
                onBack={() =>
                    navigate("/reports")
                }
            />


            {/* =================================================
                EXECUTIVE ASSESSMENT
            ================================================= */}

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    mb: 3
                }}
            >

                <SectionTitle
                    icon={
                        <SecurityIcon />
                    }
                    title="Executive Assessment"
                />

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >

                    {
                        assessment.attack_type ||
                        report.title
                    }

                </Typography>

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


                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >

                    <InfoBadge
                        label="Severity"
                        value={
                            assessment.severity ||
                            report.severity ||
                            "Unknown"
                        }
                    />

                    <InfoBadge
                        label="Confidence"
                        value={
                            assessment.confidence ||
                            "Unknown"
                        }
                    />

                    <InfoBadge
                        label="Impact"
                        value={
                            assessment.impact ||
                            "Unknown"
                        }
                    />

                </Box>

            </Paper>


            {/* =================================================
                TECHNICAL ANALYSIS
            ================================================= */}

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    mb: 3
                }}
            >

                <SectionTitle
                    icon={
                        <TerminalIcon />
                    }
                    title="Technical Analysis"
                />

                <AnalysisBlock
                    title="What happened"
                    content={
                        technical.what_happened
                    }
                />

                <AnalysisBlock
                    title="Why was the alert triggered?"
                    content={
                        technical.detection_reason
                    }
                />

                <AnalysisBlock
                    title="Evidence analysis"
                    content={
                        technical.evidence_analysis
                    }
                />

                <AnalysisBlock
                    title="Affected entities"
                    content={
                        technical.affected_entities
                    }
                />

            </Paper>


            {/* =================================================
                EVIDENCE
            ================================================= */}

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    mb: 3
                }}
            >

                <SectionTitle
                    icon={
                        <WarningIcon />
                    }
                    title="Observed Evidence"
                />

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 2
                    }}
                >

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

                </Box>

            </Paper>


            {/* =================================================
                TIMELINE
            ================================================= */}

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    mb: 3
                }}
            >

                <SectionTitle
                    title="Incident Timeline"
                />

                {
                    timeline.length === 0

                        ? (

                            <Typography
                                color="text.secondary"
                            >

                                No timeline events
                                available.

                            </Typography>

                        )

                        : (

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
                                                                    ? `${event.destinationIp}${event.destinationPort ? `:${event.destinationPort}` : ""}`
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

                        )
                }

            </Paper>


            {/* =================================================
                INDICATORS
            ================================================= */}

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    mb: 3
                }}
            >

                <SectionTitle
                    title="Indicators of Interest"
                />

                <IndicatorSection
                    title="Source IPs"
                    values={
                        indicators.source_ips
                    }
                />

                <IndicatorSection
                    title="Destination IPs"
                    values={
                        indicators.destination_ips
                    }
                />

                <IndicatorSection
                    title="Usernames"
                    values={
                        indicators.usernames
                    }
                />

                <IndicatorSection
                    title="Hostnames"
                    values={
                        indicators.hostnames
                    }
                />

                <IndicatorSection
                    title="Domains"
                    values={
                        indicators.domains
                    }
                />

                <IndicatorSection
                    title="Ports"
                    values={
                        indicators.ports
                    }
                />

                <IndicatorSection
                    title="Commands"
                    values={
                        indicators.commands
                    }

                />

            </Paper>


            {/* =================================================
                MITRE ATT&CK
            ================================================= */}

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    mb: 3
                }}
            >

                <SectionTitle
                    title="MITRE ATT&CK"
                />

                {
                    mitre.length === 0

                        ? (

                            <Typography
                                color="text.secondary"
                            >

                                No MITRE ATT&CK mapping
                                available.

                            </Typography>

                        )

                        : (

                            mitre.map(
                                (
                                    technique,
                                    index
                                ) => (

                                    <Accordion
                                        key={
                                            `${technique.id}-${index}`
                                        }
                                        disableGutters
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

                        )
                }

            </Paper>


            {/* =================================================
                RISK ASSESSMENT
            ================================================= */}

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    mb: 3
                }}
            >

                <SectionTitle
                    icon={
                        <WarningIcon />
                    }
                    title="Risk Assessment"
                />

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                        mb: 3
                    }}
                >

                    <InfoBadge
                        label="Risk Level"
                        value={
                            risk.level ||
                            "Unknown"
                        }
                    />

                </Box>

                <AnalysisBlock
                    title="Potential Impact"
                    content={
                        risk.impact
                    }
                />

                <AnalysisBlock
                    title="Uncertainties"
                    content={
                        risk.uncertainties
                    }
                />

            </Paper>


            {/* =================================================
                RECOMMENDATIONS
            ================================================= */}

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    mb: 3
                }}
            >

                <SectionTitle
                    title="Recommendations"
                />

                {
                    recommendations.length === 0

                        ? (

                            <Typography
                                color="text.secondary"
                            >

                                No recommendations
                                available.

                            </Typography>

                        )

                        : (

                            <List>

                                {
                                    recommendations.map(
                                        (
                                            recommendation,
                                            index
                                        ) => (

                                            <ListItem
                                                key={
                                                    index
                                                }
                                                alignItems="flex-start"
                                                sx={{
                                                    mb: 1
                                                }}
                                            >

                                                <ListItemText

                                                    primary={

                                                        <Box
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                gap: 1,
                                                                alignItems:
                                                                    "center",
                                                                mb: 0.5
                                                            }}
                                                        >

                                                            <Chip
                                                                size="small"
                                                                label={
                                                                    recommendation.priority ||
                                                                    "Normal"
                                                                }
                                                                color={
                                                                    recommendation.priority?.toLowerCase() ===
                                                                    "critical"

                                                                        ? "error"

                                                                        : recommendation.priority?.toLowerCase() ===
                                                                          "high"

                                                                            ? "warning"

                                                                            : "default"
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

                                                    }

                                                    secondary={
                                                        recommendation.reason ||
                                                        ""
                                                    }

                                                />

                                            </ListItem>

                                        )
                                    )
                                }

                            </List>

                        )
                }

            </Paper>


            {/* =================================================
                CONCLUSION
            ================================================= */}

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    mb: 3
                }}
            >

                <SectionTitle
                    title="Conclusion"
                />

                <Typography
                    sx={{
                        lineHeight: 1.8
                    }}
                >

                    {
                        conclusion ||
                        "No conclusion available."
                    }

                </Typography>

            </Paper>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <ReportActions
                onDownload={
                    handleDownload
                }
                onDelete={
                    handleDelete
                }
            />

        </Layout>

    );

}


/*
 * =============================================================
 * REPORT HEADER
 * =============================================================
 */

function ReportHeader({
    report,
    severity,
    severityColor,
    onBack
}) {

    return (

        <Box
            sx={{
                mb: 4
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    mb: 3
                }}
            >

                <Button
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={onBack}
                >

                    Back

                </Button>

            </Box>


            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "flex-start",
                        gap: 3,
                        flexWrap: "wrap"
                    }}
                >

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{
                                mb: 1
                            }}
                        >

                            AI Report

                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >

                            {
                                report.title
                            }

                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 1
                            }}
                        >

                            Model:{" "}
                            {report.model}

                        </Typography>

                        <Typography
                            color="text.secondary"
                        >

                            Generated:{" "}
                            {
                                formatDate(
                                    report.created_at
                                )
                            }

                        </Typography>

                    </Box>


                    {
                        severity && (

                            <Chip
                                label={
                                    severity.toUpperCase()
                                }
                                color={
                                    severityColor ||
                                    "default"
                                }
                                sx={{
                                    fontWeight:
                                        "bold",
                                    px: 1
                                }}
                            />

                        )
                    }

                </Box>

            </Paper>

        </Box>

    );

}


/*
 * =============================================================
 * SECTION TITLE
 * =============================================================
 */

function SectionTitle({
    title,
    icon
}) {

    return (

        <>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2
                }}
            >

                {
                    icon
                }

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

        </>

    );

}


/*
 * =============================================================
 * ANALYSIS BLOCK
 * =============================================================
 */

function AnalysisBlock({
    title,
    content
}) {

    if (!content) {

        return null;

    }

    return (

        <Box
            sx={{
                mb: 3
            }}
        >

            <Typography
                variant="subtitle1"
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

                {content}

            </Typography>

        </Box>

    );

}


/*
 * =============================================================
 * INFO BADGE
 * =============================================================
 */

function InfoBadge({
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
                px: 2,
                py: 1
            }}
        >

            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
            >

                {label}

            </Typography>

            <Typography
                fontWeight="bold"
            >

                {value}

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

        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                borderRadius: 3
            }}
        >

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

                    ? (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >

                            None observed

                        </Typography>

                    )

                    : (

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

                    )
            }

        </Paper>

    );

}


/*
 * =============================================================
 * INDICATOR SECTION
 * =============================================================
 */

function IndicatorSection({
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
                sx={{
                    mb: 1
                }}
            >

                {title}

            </Typography>

            {
                safeValues.length === 0

                    ? (

                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >

                            None observed

                        </Typography>

                    )

                    : (

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

                    )
            }

        </Box>

    );

}


/*
 * =============================================================
 * REPORT ACTIONS
 * =============================================================
 */

function ReportActions({
    onDownload,
    onDelete
}) {

    return (

        <Box
            sx={{
                mt: 4,
                mb: 5,
                display: "flex",
                gap: 2
            }}
        >

            <Button
                variant="contained"
                startIcon={
                    <DownloadIcon />
                }
                onClick={onDownload}
            >

                Download PDF

            </Button>

            <Button
                color="error"
                variant="outlined"
                startIcon={
                    <DeleteIcon />
                }
                onClick={onDelete}
            >

                Delete

            </Button>

        </Box>

    );

}


/*
 * =============================================================
 * DATE FORMATTER
 * =============================================================
 */

function formatDate(value) {

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


export default ReportDetails;