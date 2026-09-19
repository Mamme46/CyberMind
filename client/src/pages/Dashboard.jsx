import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";

import {

    getDashboardStats,

    getRecentAlerts

} from "../api/dashboard.api";

import {

    Box,

    Typography,

    Paper,

    Button

} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DangerousIcon from "@mui/icons-material/Dangerous";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import { useNavigate } from "react-router-dom";

import StatCard from "../components/dashboard/StatCard";
import RecentAlerts from "../components/dashboard/RecentAlerts";


function Dashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({

    uploads: 0,

    alerts: 0,

    criticalAlerts: 0,

    events: 0

});

const [recentAlerts, setRecentAlerts] = useState([]);

useEffect(() => {

    loadDashboard();

}, []);

async function loadDashboard() {

    try {

        const statsData = await getDashboardStats();

        const alertsData = await getRecentAlerts();

        setStats(statsData);

        setRecentAlerts(alertsData);

    }

    catch (err) {

        console.error(err);

    }

}

    const secondaryCards = [

    {

        title: "Uploads",

        value: stats.uploads,

        tone: "neutral",

        icon: <UploadFileIcon/>

    },

    {

        title: "Open Alerts",

        value: stats.alerts,

        tone: "warning",

        icon: <WarningAmberIcon/>

    },

    {

        title: "Events Analyzed",

        value: stats.events,

        tone: "info",

        icon: <DescriptionIcon/>

    }

];

    return (

    <Layout>

       <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 4
            }}
>


            {/* ===== Statistics ===== */}

        <Box
            sx={{
                display: "grid",

                gridTemplateColumns: {
                    xs: "1fr",
                    md: "minmax(280px, 1.3fr) repeat(3, 1fr)"
                },

                gap: 3
            }}
        >

                <StatCard

                    title="Critical Alerts"

                    value={stats.criticalAlerts}

                    description={

                        stats.criticalAlerts > 0

                            ? "Require immediate investigation"

                            : "No critical activity detected"

                    }

                    tone={stats.criticalAlerts > 0 ? "critical" : "neutral"}

                    icon={

                        stats.criticalAlerts > 0

                            ? <DangerousIcon/>

                            : <GppGoodOutlinedIcon/>

                    }

                    featured

                />

                {

                    secondaryCards.map(card => (

                        <StatCard

                            key={card.title}

                            title={card.title}

                            value={card.value}

                            tone={card.tone}

                            icon={card.icon}

                        />

                    ))

                }

            </Box>

            {/* ===== Main Content ===== */}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3
                }}
            >

                <RecentAlerts

                    alerts={recentAlerts}

                />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3
                    }}
                >

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 3,
                            flexWrap: "wrap"
                        }}
                    >

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

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

                                <SmartToyIcon fontSize="small" />

                            </Box>

                            <Box>
                                <Typography variant="subtitle1">
                                    AI Assistant
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Need help investigating an alert?
                                </Typography>
                            </Box>

                        </Box>


                        <Button
                            variant="contained"
                            startIcon={<SmartToyIcon />}
                            onClick={() => navigate("/ai")}
                        >
                            Open AI Assistant
                        </Button>

                    </Paper>

                </Box>

            </Box>

        </Box>

    </Layout>

);

}

export default Dashboard;