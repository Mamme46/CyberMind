import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#3a5da8",
            dark: "#2c477f",
            light: "#6c85bd"
        },
        secondary: {
            main: "#5b6472"
        },
        error: {
            main: "#b3413a",
            light: "#e7c6c3",
            dark: "#8c2f29"
        },
        warning: {
            main: "#a9691f",
            light: "#eeddc5",
            dark: "#7f4e16"
        },
        info: {
            main: "#3a6fa0",
            light: "#c9dbe9",
            dark: "#2b5378"
        },
        success: {
            main: "#3e7d55",
            light: "#cadfd0",
            dark: "#2e5e40"
        },
        background: {
            default: "#f2f3f5",
            paper: "#ffffff"
        },
        text: {
            primary: "#1c1f26",
            secondary: "#666c78"
        },
        divider: "#e3e5e9"
    },
    shape: {
        borderRadius: 10
    },
    typography: {
        fontFamily: [
            "system-ui",
            "Segoe UI",
            "Roboto",
            "sans-serif"
        ].join(","),
        fontWeightBold: 600,
        h1: { fontWeight: 600 },
        h2: { fontWeight: 600 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600, letterSpacing: -0.2 },
        h5: { fontWeight: 600, letterSpacing: -0.1 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600 },
        button: { fontWeight: 600, textTransform: "none" }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#f2f3f5"
                }
            }
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true
            },
            styleOverrides: {
                root: {
                    borderRadius: 8
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none"
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    color: "#4b5160",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    borderBottomWidth: 2
                }
            }
        }
    }
});

export default theme;
