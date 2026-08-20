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

                sx={{

                    p: 2,

                    maxWidth: "70%",

                    bgcolor: isUser

                        ? "#1976d2"

                        : "#2d3748",

                    color: "white"

                }}

            >

                <Typography

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