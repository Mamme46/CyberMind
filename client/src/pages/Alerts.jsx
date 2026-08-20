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

    Button

} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { getAlerts } from "../api/alerts.api";

function Alerts() {

    const [alerts, setAlerts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        async function loadAlerts() {

            const data = await getAlerts();

            setAlerts(data);

        }

        loadAlerts();

    }, []);

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

            <TableContainer
                component={Paper}
                sx={{
                    width: "100%",
                    borderRadius: 4,
                    overflowX: "auto"
                }}
            >

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

                            alerts.map((alert) => (

                                <TableRow key={alert.id}>

                                    <TableCell>

                                        {alert.id}

                                    </TableCell>

                                    <TableCell>

                                        <Chip

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

                                            variant="contained"

                                            onClick={() =>

                                                navigate(

                                                    `/alerts/${alert.id}`

                                                )

                                            }

                                        >

                                            Open

                                        </Button>

                                    </TableCell>

                                </TableRow>

                            ))

                        }

                    </TableBody>

                </Table>

            </TableContainer>

        </Layout>

    );

}

export default Alerts;