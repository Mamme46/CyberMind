import { Box, Typography } from "@mui/material";

function EmptyState({ icon, title, description }) {

    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 1,
                py: 6,
                px: 2,
                color: "text.secondary"
            }}
        >

            {
                icon && (

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            bgcolor: "action.hover",
                            mb: 1,
                            "& svg": {
                                fontSize: 24,
                                opacity: 0.6
                            }
                        }}
                    >

                        {icon}

                    </Box>

                )
            }

            <Typography sx={{ fontWeight: 600, color: "text.primary" }}>

                {title}

            </Typography>

            {
                description && (

                    <Typography variant="body2" sx={{ maxWidth: 360 }}>

                        {description}

                    </Typography>

                )
            }

        </Box>

    );

}

export default EmptyState;
