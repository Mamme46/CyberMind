import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip
} from "@mui/material";

function RecentAlerts({ alerts }) {

    return (

        <Paper
            sx={{
                borderRadius: 4,
                p: 3
            }}
        >

            <Typography
                variant="h5"
                fontWeight="bold"
                mb={3}
            >
                Recent Alerts
            </Typography>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell><b>Severity</b></TableCell>

                        <TableCell><b>Title</b></TableCell>

                        <TableCell><b>Source IP</b></TableCell>

                        <TableCell><b>User</b></TableCell>

                        <TableCell><b>Status</b></TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {

                        alerts.map(alert => (

                            <TableRow
                                key={alert.id}
                                hover
                            >

                                <TableCell>

                                    <Chip
                                        label={alert.severity}
                                        color={
                                            alert.severity === "critical"
                                                ? "error"
                                                : alert.severity === "high"
                                                ? "warning"
                                                : "info"
                                        }
                                    />

                                </TableCell>

                                <TableCell>

                                    {alert.title}

                                </TableCell>

                                <TableCell>

                                    {alert.source_ip}

                                </TableCell>

                                <TableCell>

                                    {alert.username}

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={alert.status}
                                        variant="outlined"
                                    />

                                </TableCell>

                            </TableRow>

                        ))

                    }

                </TableBody>

            </Table>

        </Paper>

    );

}

export default RecentAlerts;