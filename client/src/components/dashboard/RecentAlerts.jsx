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

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import EmptyState from "../common/EmptyState";

function RecentAlerts({ alerts }) {

    return (

        <Paper
            variant="outlined"
            sx={{
                borderRadius: 3,
                p: 3
            }}
        >

            <Typography
                variant="subtitle1"
                mb={2}
            >
                Recent Alerts
            </Typography>

            {

                alerts.length === 0

                    ? (

                        <EmptyState

                            icon={<WarningAmberIcon />}

                            title="No alerts yet"

                            description="Uploaded logs will surface security alerts here as they are detected."

                        />

                    )

                    : (

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>Severity</TableCell>

                        <TableCell>Title</TableCell>

                        <TableCell>Source IP</TableCell>

                        <TableCell>User</TableCell>

                        <TableCell>Status</TableCell>

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
                                        size="small"
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
                                        size="small"
                                        label={alert.status}
                                        variant="outlined"
                                    />

                                </TableCell>

                            </TableRow>

                        ))

                    }

                </TableBody>

            </Table>

                    )

            }

        </Paper>

    );

}

export default RecentAlerts;