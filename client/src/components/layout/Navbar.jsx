import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    IconButton,
    Tooltip
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useLocation } from "react-router-dom";

function Navbar() {

    const location = useLocation();
    const isAI = location.pathname.startsWith("/ai");
    const drawerWidth = isAI ? 0 : 260;

    function getTitle() {

        switch (location.pathname) {

            case "/dashboard":
                return "Dashboard";

            case "/uploads":
                return "Uploads";

            case "/alerts":
                return "Alerts";

            case "/ai":
                return "AI Assistant";

            case "/reports":
                return "Reports";

            default:
                return "CyberMind";

        }

    }

    return (

        <AppBar

            position="fixed"

            elevation={2}

            sx={{

                ml: `${drawerWidth}px`,

                width: `calc(100% - ${drawerWidth}px)`,

                bgcolor: "#1e3a8a",

                height: 70,

                justifyContent: "center"

            }}

        >

            <Toolbar

                sx={{

                    minHeight: 70,

                    px: 4,

                    display: "flex",

                    justifyContent: "space-between"

                }}

            >

                <Box

                    sx={{

                        display: "flex",

                        alignItems: "center",

                        gap: 2

                    }}

                >

                    <SmartToyIcon

                        sx={{

                            fontSize: 34,

                            color: "#60a5fa"

                        }}

                    />

                    <Box>

                        <Typography

                            variant="h5"

                            fontWeight="bold"

                        >

                            CyberMind

                        </Typography>

                        <Typography

                            variant="body2"

                            sx={{

                                opacity: .8

                            }}

                        >

                            {getTitle()}

                        </Typography>

                    </Box>

                </Box>

                <Box

                    sx={{

                        display: "flex",

                        alignItems: "center",

                        gap: 2

                    }}

                >

                    <Typography

                        fontWeight="bold"

                    >

                        Mamme

                    </Typography>

                    <Tooltip title="Profile">

                        <IconButton>

                            <Avatar

                                sx={{

                                    bgcolor:"#2563eb"

                                }}

                            >

                                <AccountCircleIcon/>

                            </Avatar>

                        </IconButton>

                    </Tooltip>

                </Box>

            </Toolbar>

        </AppBar>

    );

}

export default Navbar;