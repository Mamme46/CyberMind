import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";
import {
    Select,
    MenuItem,
    FormControl
} from "@mui/material";

import { updateAlertStatus } from "../api/alerts.api";

import {

    Typography,

    Paper,

    Table,

    TableBody,

    TableCell,

    TableContainer,

    TableHead,

    TableRow,

    Chip,

    Button,

    Box

} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import EmptyState from "../components/common/EmptyState";

import { useNavigate, useSearchParams } from "react-router-dom";

import { getAlerts } from "../api/alerts.api";

function Alerts() {

    const [alerts, setAlerts] = useState([]);

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const uploadId = searchParams.get("uploadId");

    useEffect(() => {

        async function loadAlerts() {

            const data = await getAlerts();

            setAlerts(data);

        }

        loadAlerts();

    }, []);

    const visibleAlerts = uploadId

        ? alerts.filter(alert => String(alert.upload_id) === String(uploadId))

        : alerts;

    function clearFilter() {

        setSearchParams({});

    }

    function severityColor(severity) {

        switch (severity?.toLowerCase()) {

            case "critical":
                return "error";

            case "high":
                return "warning";

            case "medium":
                return "info";

            case "low":
                return "success";

            default:
                return "default";
        }

    }

    async function handleStatusChange(id, status) {

    try {

        await updateAlertStatus(id, status);

        setAlerts(previous =>

            previous.map(alert =>

                alert.id === id

                    ? { ...alert, status }

                    : alert

            )

        );

    }

    catch (err) {

        console.error(err);

    }

}

    return (

        <Layout>

            <Box

                sx={{

                    display: "flex",

                    alignItems: "center",

                    gap: 1.5,

                    mb: 3,

                    flexWrap: "wrap"

                }}

            >

                <Typography variant="h5">

                    Alerts

                </Typography>

                {

                    uploadId && (

                        <Chip

                            size="small"

                            variant="outlined"

                            label={`Upload #${uploadId}`}

                            onDelete={clearFilter}

                        />

                    )

                }

            </Box>

            <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                    width: "100%",
                    borderRadius: 3,
                    overflowX: "auto"
                }}
            >

                {

                    visibleAlerts.length === 0

                        ? (

                            <EmptyState

                                icon={<WarningAmberIcon />}

                                title={

                                    uploadId

                                        ? "No alerts for this upload"

                                        : "No alerts to review"

                                }

                                description={

                                    uploadId

                                        ? "This upload has not triggered any alert so far."

                                        : "Alerts generated from analyzed log uploads will appear here."

                                }

                            />

                        )

                        : (

                <Table sx={{ width: "100%", tableLayout: "auto" }}>

                    <TableHead>

                        <TableRow>

                            <TableCell>ID</TableCell>

                            <TableCell>Severity</TableCell>

                            <TableCell>Title</TableCell>

                            <TableCell>Source IP</TableCell>

                            <TableCell>Username</TableCell>

                            <TableCell>Status</TableCell>

                            <TableCell>Created At</TableCell>

                            <TableCell></TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            visibleAlerts.map((alert) => (

                                <TableRow key={alert.id} hover>

                                    <TableCell>

                                        {alert.id}

                                    </TableCell>

                                    <TableCell>

                                        <Chip

                                            size="small"

                                            label={alert.severity}

                                            color={severityColor(alert.severity)}

                                        />

                                    </TableCell>

                                    <TableCell>

                                        {alert.title}

                                    </TableCell>


                                    <TableCell>

                                        {alert.source_ip || "-"}

                                    </TableCell>

                                    <TableCell>

                                        {alert.username || "-"}

                                    </TableCell>

                                    <TableCell>

                                        <FormControl
                                            size="small"
                                            sx={{ minWidth: 170 }}
                                        >

                                            <Select

                                                value={alert.status}

                                                onChange={(e) =>

                                                    handleStatusChange(

                                                        alert.id,

                                                        e.target.value

                                                    )

                                                }

                                            >

                                                <MenuItem value="Open">

                                                    Open

                                                </MenuItem>

                                                <MenuItem value="Investigating">

                                                    Investigating

                                                </MenuItem>

                                                <MenuItem value="Resolved">

                                                    Resolved

                                                </MenuItem>

                                                <MenuItem value="Closed">

                                                    Closed

                                                </MenuItem>

                                                <MenuItem value="False Positive">

                                                    False Positive

                                                </MenuItem>

                                            </Select>

                                        </FormControl>

                                    </TableCell>

                                    <TableCell>

                                        {

                                            new Date(

                                                alert.created_at

                                            ).toLocaleString()

                                        }

                                    </TableCell>

                                    <TableCell>

                                        <Button

                                            variant="outlined"

                                            size="small"

                                            onClick={() =>

                                                navigate(

                                                    `/alerts/${alert.id}`

                                                )

                                            }

                                        >

                                            Investigate

                                        </Button>

                                    </TableCell>

                                </TableRow>

                            ))

                        }

                    </TableBody>

                </Table>

                        )

                }

            </TableContainer>

        </Layout>

    );

}

export default Alerts;