import {

    Drawer,

    Toolbar,

    List,

    ListItemButton,

    ListItemText,

    Typography,

    Box,

    Divider,

    Avatar

} from "@mui/material";

import SecurityIcon from "@mui/icons-material/Security";

import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 260;

const menuItems = [

    {

        text: "Dashboard",

        path: "/dashboard"

    },

    {

        text: "Uploads",

        path: "/uploads"

    },

    {

        text: "Alerts",

        path: "/alerts"

    },


    {

        text: "AI Assistant",

        path: "/ai"

    },

    {

        text: "Reports",

        path: "/reports"

    },

    {
        text: "Security Assessment",
        path: "/security"
    }

];

function Sidebar({ open = true }) {

    const navigate = useNavigate();

    const location = useLocation();

    function logout() {

        localStorage.removeItem("token");

        navigate("/");

    }

    if (!open) {

        return null;

    }

    return (

        <Drawer

            variant="permanent"

            sx={{

                width: drawerWidth,

                flexShrink: 0,

                "& .MuiDrawer-paper": {

                    width: drawerWidth,

                    bgcolor: "#1a1d24",

                    color: "#d7d9de",

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

                            color: "#7c93c9",

                            fontSize: 30

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

                                color: "#9199a6"

                            }}

                        >

                            Security Platform

                        </Typography>

                    </Box>

                </Box>

            </Toolbar>

            <Divider

                sx={{

                    borderColor: "#2a2d35"

                }}

            />

            <List

                sx={{

                    mt: 2,

                    px: 1.5

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

                                borderRadius: 2,

                                mb: 0.5,

                                py: 1.2,

                                pl: 2,

                                borderLeft: "3px solid transparent",

                                "&.Mui-selected": {

                                    bgcolor: "#262a33",

                                    borderLeftColor: "#7c93c9",

                                    color: "#f2f3f5"

                                },

                                "&.Mui-selected:hover": {

                                    bgcolor: "#2c313c"

                                },

                                "&:hover": {

                                    bgcolor: "#20232a"

                                }

                            }}

                        >

                            <ListItemText

                                primary={item.text}

                                primaryTypographyProps={{

                                    fontSize: 14

                                }}

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

                    borderColor: "#2a2d35"

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

                        gap: 1.5,

                        mb: 1.5,

                        px: 0.5

                    }}

                >

                    <Avatar

                        sx={{

                            bgcolor: "#3a5da8",

                            width: 34,

                            height: 34,

                            fontSize: 15

                        }}

                    >

                        M

                    </Avatar>

                    <Typography sx={{ fontSize: 14 }}>

                        Mamme

                    </Typography>

                </Box>

                <ListItemButton

                    onClick={logout}

                    sx={{

                        borderRadius: 2,

                        pl: 2,

                        color: "#c8837c"

                    }}

                >

                    <ListItemText

                        primary="Logout"

                        primaryTypographyProps={{ fontSize: 14 }}

                    />

                </ListItemButton>

            </Box>

        </Drawer>

    );

}

export default Sidebar;