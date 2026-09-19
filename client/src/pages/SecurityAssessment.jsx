import { useState } from "react";

import {
    Paper,
    Typography,
    Button,
    Box,
    CircularProgress,
    Chip,
    Divider
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SecurityIcon
    from "@mui/icons-material/Security";

import { runSecurityScan }
    from "../api/security.api";

import Layout
    from "../components/layout/Layout";

import EmptyState
    from "../components/common/EmptyState";

function findingSeverityColor(severity) {

    const value = String(severity || "").toLowerCase();

    if (value === "critical") return "error";
    if (value === "high") return "warning";
    if (value === "medium") return "info";
    if (value === "low") return "success";

    return "default";

}


function SecurityAssessment() {

    const [result, setResult] = useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    async function handleScan() {

        try {

            setLoading(true);

            setError("");

            const data =
                await runSecurityScan();

            setResult(data);

        }

        catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Security scan failed."
            );

        }

        finally {

            setLoading(false);

        }

    }


    function getSummary() {

        const summary = {

            critical: 0,

            high: 0,

            medium: 0,

            low: 0,

            secrets: 0,

            misconfigurations: 0

        };


        if (!result?.Results) {

            return summary;

        }


        for (const target of result.Results) {

            const vulnerabilities =
                target.Vulnerabilities || [];


            for (const vulnerability of vulnerabilities) {

                const severity =
                    vulnerability.Severity?.toLowerCase();


                if (
                    severity === "critical" ||
                    severity === "high" ||
                    severity === "medium" ||
                    severity === "low"
                ) {

                    summary[severity]++;

                }

            }


            const secrets =
                target.Secrets || [];


            summary.secrets +=
                secrets.length;


            const misconfigurations =
                target.Misconfigurations || [];


            summary.misconfigurations +=
                misconfigurations.length;

        }


        return summary;

    }


    const summary = getSummary();

    function getFindings() {

    const findings = [];

    if (!result?.Results) {
        return findings;
    }

    for (const target of result.Results) {

        // Vulnerabilities
        for (const vulnerability of target.Vulnerabilities || []) {

            findings.push({
                type: "Vulnerability",
                severity: vulnerability.Severity || "UNKNOWN",
                id: vulnerability.VulnerabilityID || "N/A",
                title: vulnerability.Title || "No title available",
                description:
                    vulnerability.Description ||
                    "No description available.",
                target: target.Target,
                package:
                    vulnerability.PkgName || "N/A",
                installedVersion:
                    vulnerability.InstalledVersion || "N/A",
                fixedVersion:
                    vulnerability.FixedVersion || "Not available"
            });

        }

        // Secrets
        for (const secret of target.Secrets || []) {

            findings.push({
                type: "Secret",
                severity: secret.Severity || "UNKNOWN",
                id:
                    secret.RuleID ||
                    secret.Category ||
                    "Secret detected",
                title:
                    secret.Title ||
                    "Potential secret detected",
                description:
                    secret.Match ||
                    "A potential secret was detected.",
                target: target.Target,
                package: null,
                installedVersion: null,
                fixedVersion: null
            });

        }

        // Misconfigurations
        for (const misconfiguration of
            target.Misconfigurations || []) {

            findings.push({
                type: "Misconfiguration",
                severity:
                    misconfiguration.Severity ||
                    "UNKNOWN",
                id:
                    misconfiguration.ID ||
                    "N/A",
                title:
                    misconfiguration.Title ||
                    "Security misconfiguration",
                description:
                    misconfiguration.Message ||
                    "No description available.",
                target: target.Target,
                package: null,
                installedVersion: null,
                fixedVersion: null
            });

        }

    }

    return findings;
}

const findings = getFindings();


    return (

        <Layout>

            <Typography
                variant="h4"
                mb={3}
            >

                Security Assessment

            </Typography>


            <Paper
                variant="outlined"
                sx={{
                    p: 4,
                    mb: 3,
                    borderRadius: 3
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

                    <Box

                        sx={{

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            width: 42,

                            height: 42,

                            borderRadius: "50%",

                            bgcolor: "#e9f0f6",

                            color: "#3a6fa0",

                            flexShrink: 0

                        }}

                    >

                        <SecurityIcon fontSize="small" />

                    </Box>

                    <Typography
                        variant="h5"
                    >

                        Application Security Scan

                    </Typography>

                </Box>


                <Typography
                    color="text.secondary"
                    mb={3}
                >

                    Scan CyberMind for known
                    vulnerabilities, secrets and
                    security misconfigurations.

                </Typography>


                <Button

                    variant="contained"

                    startIcon={
                        loading
                            ? <CircularProgress
                                size={20}
                                color="inherit"
                              />
                            : <SecurityIcon />
                    }

                    onClick={handleScan}

                    disabled={loading}

                >

                    {loading
                        ? "Scanning..."
                        : "Run Security Scan"
                    }

                </Button>


                {error && (

                    <Typography
                        color="error"
                        sx={{ mt: 2 }}
                    >

                        {error}

                    </Typography>

                )}

            </Paper>


            {result && (

                <>

                    <Typography
                        variant="h5"
                        mb={2}
                    >

                        Scan Results

                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "repeat(2, 1fr)",
                                sm: "repeat(3, 1fr)",
                                md: "repeat(6, 1fr)"
                            },
                            gap: 2,
                            mb: 3
                        }}
                    >

                        <ScanTile
                            label="Critical"
                            value={summary.critical}
                            tone={summary.critical > 0 ? "critical" : "neutral"}
                        />

                        <ScanTile
                            label="High"
                            value={summary.high}
                            tone={summary.high > 0 ? "warning" : "neutral"}
                        />

                        <ScanTile
                            label="Medium"
                            value={summary.medium}
                            tone="neutral"
                        />

                        <ScanTile
                            label="Low"
                            value={summary.low}
                            tone="neutral"
                        />

                        <ScanTile
                            label="Secrets"
                            value={summary.secrets}
                            tone={summary.secrets > 0 ? "warning" : "neutral"}
                        />

                        <ScanTile
                            label="Misconfigurations"
                            value={summary.misconfigurations}
                            tone="neutral"
                        />

                    </Box>


                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>

                        <Typography
                            variant="h6"
                            mb={2}
                        >

                            Scan Targets

                        </Typography>


                        {result.Results?.map(
                            (target, index) => (

                                <Box
                                    key={index}
                                    sx={{ mb: 3 }}
                                >

                                    <Typography
                                        variant="subtitle2"
                                    >

                                        {target.Target}

                                    </Typography>


                                    <Box
                                        sx={{ mt: 1 }}
                                    >

                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            label={`Vulnerabilities: ${
                                                target.Vulnerabilities?.length || 0
                                            }`}
                                            sx={{
                                                mr: 1,
                                                mb: 1
                                            }}
                                        />


                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            label={`Secrets: ${
                                                target.Secrets?.length || 0
                                            }`}
                                            sx={{
                                                mr: 1,
                                                mb: 1
                                            }}
                                        />


                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            label={`Misconfigurations: ${
                                                target.Misconfigurations?.length || 0
                                            }`}
                                            sx={{
                                                mr: 1,
                                                mb: 1
                                            }}
                                        />

                                    </Box>


                                    <Divider
                                        sx={{ mt: 2 }}
                                    />

                                </Box>

                            )
                        )}

                    </Paper>

                    <Paper variant="outlined" sx={{ p: 3, mt: 3, borderRadius: 3 }}>

    <Typography
        variant="h6"
        mb={3}
    >
        Security Findings
    </Typography>

    {findings.length === 0 ? (

        <EmptyState

            icon={<SecurityIcon />}

            title="No security findings detected"

            description="The last scan did not surface any vulnerability, secret or misconfiguration."

        />

    ) : (

        findings.map((finding, index) => (

            <Paper
                key={index}
                variant="outlined"
                sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 2
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >

                    <Box>

                        <Typography
                            variant="subtitle1"
                        >
                            {finding.title}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {finding.id}
                        </Typography>

                    </Box>

                    <Box>

                        <Chip
                            size="small"
                            variant="outlined"
                            label={finding.type}
                            sx={{ mr: 1 }}
                        />

                        <Chip
                            size="small"
                            label={finding.severity}
                            color={findingSeverityColor(finding.severity)}
                        />

                    </Box>

                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    {finding.description}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="body2">
                    <Typography component="span" variant="body2" color="text.secondary">Target: </Typography>
                    {finding.target}
                </Typography>

                {finding.package && (

                    <Typography variant="body2">
                        <Typography component="span" variant="body2" color="text.secondary">Package: </Typography>
                        {finding.package}
                    </Typography>

                )}

                {finding.installedVersion && (

                    <Typography variant="body2">
                        <Typography component="span" variant="body2" color="text.secondary">Installed version: </Typography>
                        {finding.installedVersion}
                    </Typography>

                )}

                {finding.fixedVersion && (

                    <Typography variant="body2">
                        <Typography component="span" variant="body2" color="text.secondary">Fixed version: </Typography>
                        {finding.fixedVersion}
                    </Typography>

                )}

            </Paper>

        ))

    )}

</Paper>

                </>

            )}

        </Layout>

    );

}


const SCAN_TILE_TONES = {

    neutral: { accent: "#5b6472", tint: "#f2f3f5" },
    warning: { accent: "#a9691f", tint: "#f6efe3" },
    critical: { accent: "#b3413a", tint: "#f7e9e8" }

};

function ScanTile({ label, value, tone = "neutral" }) {

    const palette = SCAN_TILE_TONES[tone] || SCAN_TILE_TONES.neutral;

    return (

        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                borderRadius: 3,
                borderLeft: "3px solid",
                borderLeftColor: palette.accent,
                bgcolor: value > 0 ? palette.tint : "background.paper"
            }}
        >

            <Typography
                variant="body2"
                color="text.secondary"
            >

                {label}

            </Typography>

            <Typography
                variant="h4"
                sx={{ color: value > 0 ? palette.accent : "text.primary" }}
            >

                {value}

            </Typography>

        </Paper>

    );

}

export default SecurityAssessment;