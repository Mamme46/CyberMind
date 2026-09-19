import {

    Box,

    Paper,

    Typography

} from "@mui/material";

function MessageBubble({ role, content }) {

    const isUser = role === "user";

    return (

        <Box

            sx={{

                display: "flex",

                justifyContent: isUser

                    ? "flex-end"

                    : "flex-start",

                mb: 2

            }}

        >

            <Paper

                variant={isUser ? "elevation" : "outlined"}

                elevation={0}

                sx={{

                    p: 2,

                    maxWidth: "70%",

                    borderRadius: 3,

                    bgcolor: isUser

                        ? "#3a5da8"

                        : "background.paper",

                    color: isUser

                        ? "#ffffff"

                        : "text.primary"

                }}

            >

                <Typography

                    variant="body2"

                    sx={{

                        whiteSpace: "pre-wrap"

                    }}

                >

                    {content}

                </Typography>

            </Paper>

        </Box>

    );

}

export default MessageBubble;