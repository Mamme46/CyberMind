import { Box, Toolbar } from "@mui/material";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

    const location = useLocation();
    const drawerWidth =260;

    return (

        <Box
            sx={{
                display: "flex",
                bgcolor: "#f1f5f9",
                minHeight: "100vh"
            }}
        >

            <Navbar />

            <Sidebar />

            <Box
                component="main"
                sx={{

                    flexGrow: 1,

                    minWidth: 0, 

                    minHeight: "100vh",

                    bgcolor: "#f1f5f9"

                }}
            >

                <Toolbar />

                <Box
                    sx={{

                        p: 4,

                        width: "100%",

                        maxWidth: "100%",

                        boxSizing: "border-box"

                    }}
                >

                    {children}

                </Box>

            </Box>

        </Box>

    );

}

export default Layout;