import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import {

    Box,

    Typography,

    Paper,

    Button,

    Table,

    TableHead,

    TableBody,

    TableRow,

    TableCell,

    TableContainer,

    Chip,

    CircularProgress

} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";

import Layout from "../components/layout/Layout";
import EmptyState from "../components/common/EmptyState";

import { getUpload } from "../api/upload.api";
import { getUploadLogs } from "../api/logs.api";

function severityColor(severity) {

    const value = String(severity || "").toLowerCase();

    if (value === "critical") return "error";
    if (value === "high") return "warning";
    if (value === "medium") return "info";
    if (value === "low") return "success";

    return "default";

}

function UploadLogs() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [upload, setUpload] = useState(null);

    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function load() {

            try {

                setLoading(true);

                const [uploadData, logsData] = await Promise.all([

                    getUpload(id),

                    getUploadLogs(id)

                ]);

                setUpload(uploadData);

                setLogs(logsData);

            }

            catch (err) {

                console.error(err);

            }

            finally {

                setLoading(false);

            }

        }

        load();

    }, [id]);

    return (

        <Layout>

            <Button

                startIcon={<ArrowBackIcon />}

                onClick={() => navigate(`/uploads/${id}`)}

                sx={{ mb: 2 }}

            >

                Back to upload

            </Button>

            <Typography variant="h5" mb={0.5}>

                Log Events

            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>

                {upload ? upload.original_name : `Upload #${id}`}

            </Typography>

            {

                loading

                    ? (

                        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>

                            <CircularProgress />

                        </Box>

                    )

                    : (

                        <Paper variant="outlined" sx={{ borderRadius: 3 }}>

                            {

                                logs.length === 0

                                    ? (

                                        <EmptyState

                                            icon={<DescriptionIcon />}

                                            title="No log events found"

                                            description="This upload did not produce any parsed log events."

                                        />

                                    )

                                    : (

                                        <TableContainer>

                                            <Table>

                                                <TableHead>

                                                    <TableRow>

                                                        <TableCell>Time</TableCell>

                                                        <TableCell>Type</TableCell>

                                                        <TableCell>Severity</TableCell>

                                                        <TableCell>Host</TableCell>

                                                        <TableCell>Source IP</TableCell>

                                                        <TableCell>Destination IP</TableCell>

                                                        <TableCell>Message</TableCell>

                                                    </TableRow>

                                                </TableHead>

                                                <TableBody>

                                                    {

                                                        logs.map(log => (

                                                            <TableRow key={log.id} hover>

                                                                <TableCell sx={{ whiteSpace: "nowrap" }}>

                                                                    {

                                                                        log.event_time

                                                                            ? new Date(log.event_time).toLocaleString()

                                                                            : "-"

                                                                    }

                                                                </TableCell>

                                                                <TableCell>

                                                                    {log.event_type || "-"}

                                                                </TableCell>

                                                                <TableCell>

                                                                    {

                                                                        log.severity

                                                                            ? (

                                                                                <Chip

                                                                                    size="small"

                                                                                    label={log.severity}

                                                                                    color={severityColor(log.severity)}

                                                                                />

                                                                            )

                                                                            : "-"

                                                                    }

                                                                </TableCell>

                                                                <TableCell>

                                                                    {log.hostname || "-"}

                                                                </TableCell>

                                                                <TableCell>

                                                                    {log.source_ip || "-"}

                                                                </TableCell>

                                                                <TableCell>

                                                                    {log.destination_ip || "-"}

                                                                </TableCell>

                                                                <TableCell sx={{ maxWidth: 320 }}>

                                                                    <Typography

                                                                        variant="body2"

                                                                        noWrap

                                                                        title={log.message || log.raw_log || ""}

                                                                    >

                                                                        {log.message || log.raw_log || "-"}

                                                                    </Typography>

                                                                </TableCell>

                                                            </TableRow>

                                                        ))

                                                    }

                                                </TableBody>

                                            </Table>

                                        </TableContainer>

                                    )

                            }

                        </Paper>

                    )

            }

        </Layout>

    );

}

export default UploadLogs;
