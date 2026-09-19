import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    IconButton,
    Tooltip
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";

function Navbar({ sidebarOpen = true, onToggleSidebar }) {

    const location = useLocation();
    const isAI = location.pathname.startsWith("/ai");
    const drawerWidth = (isAI || !sidebarOpen) ? 0 : 260;

    function getTitle() {

        const path = location.pathname;

        if (path.startsWith("/uploads")) return "Uploads";
        if (path.startsWith("/alerts")) return "Alerts";
        if (path.startsWith("/ai")) return "AI Assistant";
        if (path.startsWith("/reports")) return "Reports";
        if (path.startsWith("/security")) return "Security Assessment";
        if (path.startsWith("/dashboard")) return "Dashboard";

        return "CyberMind";

    }

    return (

        <AppBar

            position="fixed"

            elevation={0}

            sx={{

                ml: `${drawerWidth}px`,

                width: `calc(100% - ${drawerWidth}px)`,

                bgcolor: "#1a1d24",

                borderBottom: "1px solid #2a2d35",

                height: 64,

                justifyContent: "center"

            }}

        >

            <Toolbar

                sx={{

                    minHeight: 64,

                    px: 4,

                    display: "flex",

                    justifyContent: "space-between"

                }}

            >

                <Box

                    sx={{

                        display: "flex",

                        alignItems: "center",

                        gap: 1.5

                    }}

                >

                    <Tooltip title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}>

                        <IconButton

                            size="small"

                            onClick={onToggleSidebar}

                            sx={{ color: "#d7d9de" }}

                        >

                            <MenuIcon fontSize="small" />

                        </IconButton>

                    </Tooltip>

                    <Box>

                        <Typography

                            variant="h6"

                        >

                            {getTitle()}

                        </Typography>

                        <Typography

                            variant="caption"

                            sx={{

                                color: "#9199a6"

                            }}

                        >

                            CyberMind Security Platform

                        </Typography>

                    </Box>

                </Box>

                <Box

                    sx={{

                        display: "flex",

                        alignItems: "center",

                        gap: 1.5

                    }}

                >

                    <Typography

                        sx={{ fontSize: 14 }}

                    >

                        Mamme

                    </Typography>

                    <Tooltip title="Profile">

                        <IconButton size="small">

                            <Avatar

                                sx={{

                                    bgcolor:"#3a5da8",

                                    width: 32,

                                    height: 32

                                }}

                            >

                                <AccountCircleIcon fontSize="small"/>

                            </Avatar>

                        </IconButton>

                    </Tooltip>

                </Box>

            </Toolbar>

        </AppBar>

    );

}

export default Navbar;