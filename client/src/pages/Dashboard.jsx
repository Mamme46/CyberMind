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

    const cards = [

    {

        title: "Uploads",

        value: stats.uploads,

        color: "linear-gradient(135deg,#2563eb,#1d4ed8)",

        icon: <UploadFileIcon sx={{ fontSize: 70 }}/>

    },

    {

        title: "Alerts",

        value: stats.alerts,

        color: "linear-gradient(135deg,#f59e0b,#d97706)",

        icon: <WarningAmberIcon sx={{ fontSize: 70 }}/>

    },

    {

        title: "Critical",

        value: stats.criticalAlerts,

        color: "linear-gradient(135deg,#ef4444,#b91c1c)",

        icon: <DangerousIcon sx={{ fontSize: 70 }}/>

    },

    {

        title: "Events",

        value: stats.events,

        color: "linear-gradient(135deg,#7c3aed,#5b21b6)",

        icon: <DescriptionIcon sx={{ fontSize: 70 }}/>

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
                    md: "repeat(2, 280px)",
                    xl: "repeat(4, 260px)"
                },

                justifyContent: "start",

                gap: 3
            }}
        >

                {

                    cards.map(card => (

                        <StatCard

                            key={card.title}

                            title={card.title}

                            value={card.value}

                            color={card.color}

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
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 3,
                            flexWrap: "wrap"
                        }}
                    >

                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                AI Assistant
                            </Typography>
                            <Typography sx={{ mt: 1 }} color="text.secondary">
                                Need help investigating an alert?
                            </Typography>
                        </Box>


                        <Button
                            variant="contained"
                            startIcon={<SmartToyIcon />}
                            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
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