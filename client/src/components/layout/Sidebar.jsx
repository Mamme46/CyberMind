import {

    Drawer,

    Toolbar,

    List,

    ListItemButton,

    ListItemIcon,

    ListItemText,

    Typography,

    Box,

    Divider,

    Avatar

} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";

import UploadFileIcon from "@mui/icons-material/UploadFile";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import SearchIcon from "@mui/icons-material/Search";

import SmartToyIcon from "@mui/icons-material/SmartToy";

import DescriptionIcon from "@mui/icons-material/Description";

import LogoutIcon from "@mui/icons-material/Logout";

import SecurityIcon from "@mui/icons-material/Security";

import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 260;

const menuItems = [

    {

        text: "Dashboard",

        icon: <DashboardIcon />,

        path: "/dashboard"

    },

    {

        text: "Uploads",

        icon: <UploadFileIcon />,

        path: "/uploads"

    },

    {

        text: "Alerts",

        icon: <WarningAmberIcon />,

        path: "/alerts"

    },


    {

        text: "AI Assistant",

        icon: <SmartToyIcon />,

        path: "/ai"

    },

    {

        text: "Reports",

        icon: <DescriptionIcon />,

        path: "/reports"

    },

    {
        text: "Security Assessment",
        icon: <SecurityIcon />,
        path: "/security"
    }

];

function Sidebar() {

    const navigate = useNavigate();

    const location = useLocation();

    function logout() {

        localStorage.removeItem("token");

        navigate("/login");

    }

    return (

        <Drawer

            variant="permanent"

            sx={{

                width: drawerWidth,

                flexShrink: 0,

                "& .MuiDrawer-paper": {

                    width: drawerWidth,

                    bgcolor: "#111827",

                    color: "white",

                    borderRight: "none",

                    display: "flex",

                    flexDirection: "column"

                }

            }}

        >

            <Toolbar>

                <Box

                    sx={{

                        display: "flex",

                        alignItems: "center",

                        gap: 1.5

                    }}

                >

                    <SecurityIcon

                        sx={{

                            color: "#3b82f6",

                            fontSize: 34

                        }}

                    />

                    <Box>

                        <Typography

                            variant="h6"

                            sx={{

                                fontWeight: 700

                            }}

                        >

                            CyberMind

                        </Typography>

                        <Typography

                            variant="caption"

                            sx={{

                                color: "#9ca3af"

                            }}

                        >

                            Security Platform

                        </Typography>

                    </Box>

                </Box>

            </Toolbar>

            <Divider

                sx={{

                    borderColor: "#1f2937"

                }}

            />

            <List

                sx={{

                    mt: 2,

                    px: 1

                }}

            >

                {

                    menuItems.map(item => (

                        <ListItemButton

                            key={item.text}

                            onClick={() =>

                                navigate(item.path)

                            }

                            selected={

                                location.pathname ===

                                item.path

                            }

                            sx={{

                                borderRadius: 3,

                                mb: 1,

                                py: 1.5,

                                "&.Mui-selected": {

                                    bgcolor: "#2563eb",

                                    color: "white"

                                },

                                "&.Mui-selected:hover": {

                                    bgcolor: "#1d4ed8"

                                },

                                "&:hover": {

                                    bgcolor: "#1f2937"

                                }

                            }}

                        >

                            <ListItemIcon

                                sx={{

                                    color: "inherit",

                                    minWidth: 40

                                }}

                            >

                                {item.icon}

                            </ListItemIcon>

                            <ListItemText

                                primary={item.text}

                            />

                        </ListItemButton>

                    ))

                }

            </List>

            <Box

                sx={{

                    flexGrow: 1

                }}

            />

            <Divider

                sx={{

                    borderColor: "#1f2937"

                }}

            />

            <Box

                sx={{

                    p: 2

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

                    <Avatar

                        sx={{

                            bgcolor: "#2563eb"

                        }}

                    >

                        M

                    </Avatar>

                    <Box>

                        <Typography>

                            Mamme

                        </Typography>

                        <Typography

                            variant="caption"

                            sx={{

                                color: "#9ca3af"

                            }}

                        >

                            SOC Analyst

                        </Typography>

                    </Box>

                </Box>

                <ListItemButton

                    onClick={logout}

                    sx={{

                        borderRadius: 3,

                        color: "#ef4444"

                    }}

                >

                    <ListItemIcon

                        sx={{

                            color: "#ef4444"

                        }}

                    >

                        <LogoutIcon/>

                    </ListItemIcon>

                    <ListItemText

                        primary="Logout"

                    />

                </ListItemButton>

            </Box>

        </Drawer>

    );

}

export default Sidebar;