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
                sx={{
                    p: 4,
                    mb: 3
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

                    <SecurityIcon
                        fontSize="large"
                    />

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
                                xs: "1fr",
                                sm: "repeat(3, 1fr)"
                            },
                            gap: 2,
                            mb: 3
                        }}
                    >

                        <Paper sx={{ p: 3 }}>

                            <Typography
                                color="text.secondary"
                            >

                                Critical

                            </Typography>

                            <Typography
                                variant="h3"
                            >

                                {summary.critical}

                            </Typography>

                        </Paper>


                        <Paper sx={{ p: 3 }}>

                            <Typography
                                color="text.secondary"
                            >

                                High

                            </Typography>

                            <Typography
                                variant="h3"
                            >

                                {summary.high}

                            </Typography>

                        </Paper>


                        <Paper sx={{ p: 3 }}>

                            <Typography
                                color="text.secondary"
                            >

                                Medium

                            </Typography>

                            <Typography
                                variant="h3"
                            >

                                {summary.medium}

                            </Typography>

                        </Paper>


                        <Paper sx={{ p: 3 }}>

                            <Typography
                                color="text.secondary"
                            >

                                Low

                            </Typography>

                            <Typography
                                variant="h3"
                            >

                                {summary.low}

                            </Typography>

                        </Paper>


                        <Paper sx={{ p: 3 }}>

                            <Typography
                                color="text.secondary"
                            >

                                Secrets

                            </Typography>

                            <Typography
                                variant="h3"
                            >

                                {summary.secrets}

                            </Typography>

                        </Paper>


                        <Paper sx={{ p: 3 }}>

                            <Typography
                                color="text.secondary"
                            >

                                Misconfigurations

                            </Typography>

                            <Typography
                                variant="h3"
                            >

                                {summary.misconfigurations}

                            </Typography>

                        </Paper>

                    </Box>


                    <Paper sx={{ p: 3 }}>

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
                                        fontWeight="bold"
                                    >

                                        {target.Target}

                                    </Typography>


                                    <Box
                                        sx={{ mt: 1 }}
                                    >

                                        <Chip
                                            label={`Vulnerabilities: ${
                                                target.Vulnerabilities?.length || 0
                                            }`}
                                            sx={{
                                                mr: 1,
                                                mb: 1
                                            }}
                                        />


                                        <Chip
                                            label={`Secrets: ${
                                                target.Secrets?.length || 0
                                            }`}
                                            sx={{
                                                mr: 1,
                                                mb: 1
                                            }}
                                        />


                                        <Chip
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

                    <Paper sx={{ p: 3, mt: 3 }}>

    <Typography
        variant="h6"
        mb={3}
    >
        Security Findings
    </Typography>

    {findings.length === 0 ? (

        <Typography color="text.secondary">
            No security findings detected.
        </Typography>

    ) : (

        findings.map((finding, index) => (

            <Paper
                key={index}
                variant="outlined"
                sx={{
                    p: 3,
                    mb: 2
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2
                    }}
                >

                    <Box>

                        <Typography
                            variant="h6"
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
                            label={finding.type}
                            sx={{ mr: 1 }}
                        />

                        <Chip
                            label={finding.severity}
                        />

                    </Box>

                </Box>

                <Typography
                    variant="body2"
                    sx={{ mb: 2 }}
                >
                    {finding.description}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="body2">
                    <strong>Target:</strong>{" "}
                    {finding.target}
                </Typography>

                {finding.package && (

                    <Typography variant="body2">
                        <strong>Package:</strong>{" "}
                        {finding.package}
                    </Typography>

                )}

                {finding.installedVersion && (

                    <Typography variant="body2">
                        <strong>Installed version:</strong>{" "}
                        {finding.installedVersion}
                    </Typography>

                )}

                {finding.fixedVersion && (

                    <Typography variant="body2">
                        <strong>Fixed version:</strong>{" "}
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


export default SecurityAssessment;