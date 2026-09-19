import { Card, Box, Typography } from "@mui/material";

const TONES = {

    neutral: {
        accent: "#5b6472",
        tint: "#f2f3f5",
        icon: "#5b6472"
    },

    critical: {
        accent: "#b3413a",
        tint: "#f7e9e8",
        icon: "#b3413a"
    },

    warning: {
        accent: "#a9691f",
        tint: "#f6efe3",
        icon: "#a9691f"
    },

    info: {
        accent: "#3a6fa0",
        tint: "#e9f0f6",
        icon: "#3a6fa0"
    }

};

function StatCard({

    title,

    value,

    description,

    tone = "neutral",

    icon,

    featured = false

}) {

    const palette = TONES[tone] || TONES.neutral;

    return (

        <Card

            variant="outlined"

            sx={{

                borderRadius: 3,

                borderColor: featured ? palette.accent : "divider",

                borderLeftWidth: 4,

                borderLeftColor: palette.accent,

                px: featured ? 3.5 : 2.5,

                py: featured ? 3 : 2,

                display: "flex",

                alignItems: "center",

                justifyContent: "space-between",

                gap: 2,

                height: "100%",

                transition: "box-shadow .2s, transform .2s",

                "&:hover": {

                    boxShadow: "0 4px 14px rgba(20,22,30,0.08)",

                    transform: "translateY(-2px)"

                }

            }}

        >

            <Box sx={{ minWidth: 0 }}>

                <Typography

                    variant="body2"

                    sx={{ color: "text.secondary", mb: 0.5 }}

                >

                    {title}

                </Typography>

                <Typography

                    sx={{

                        fontSize: featured ? 40 : 26,

                        fontWeight: 600,

                        color: "text.primary",

                        lineHeight: 1.1

                    }}

                >

                    {value}

                </Typography>

                {

                    description && (

                        <Typography

                            variant="caption"

                            sx={{ color: "text.secondary", mt: 0.5, display: "block" }}

                        >

                            {description}

                        </Typography>

                    )

                }

            </Box>

            <Box

                sx={{

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    width: featured ? 56 : 42,

                    height: featured ? 56 : 42,

                    borderRadius: "50%",

                    bgcolor: palette.tint,

                    color: palette.icon,

                    flexShrink: 0,

                    "& svg": {

                        fontSize: featured ? 28 : 20

                    }

                }}

            >

                {icon}

            </Box>

        </Card>

    );

}

export default StatCard;
