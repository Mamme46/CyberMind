import { useState } from "react";
import { Box, Toolbar } from "@mui/material";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(() => {

        const stored = localStorage.getItem("sidebarOpen");

        return stored === null ? true : stored === "true";

    });

    function toggleSidebar() {

        setSidebarOpen(previous => {

            const next = !previous;

            localStorage.setItem("sidebarOpen", String(next));

            return next;

        });

    }

    return (

        <Box
            sx={{
                display: "flex",
                bgcolor: "background.default",
                minHeight: "100vh"
            }}
        >

            <Navbar

                sidebarOpen={sidebarOpen}

                onToggleSidebar={toggleSidebar}

            />

            <Sidebar open={sidebarOpen} />

            <Box
                component="main"
                sx={{

                    flexGrow: 1,

                    minWidth: 0,

                    minHeight: "100vh",

                    bgcolor: "background.default"

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