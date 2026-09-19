import {

    Box,

    IconButton,

    TextField

} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import {

    useState

} from "react";

function ChatInput({ onSend }) {

    const [message, setMessage] = useState("");

    function send() {

        if (!message.trim())

            return;

        onSend(message);

        setMessage("");

    }

    return (

        <Box

            sx={{

                display: "flex",

                alignItems: "center",

                gap: 1.5,

                p: 2,

                borderTop: "1px solid",

                borderColor: "divider"

            }}

        >

            <TextField

                fullWidth

                size="small"

                placeholder="Ask CyberMind AI..."

                value={message}

                onChange={(e) =>

                    setMessage(e.target.value)

                }

                onKeyDown={(e) => {

                    if (e.key === "Enter")

                        send();

                }}

            />

            <IconButton

                color="primary"

                onClick={send}

                disabled={!message.trim()}

                sx={{

                    bgcolor: "primary.main",

                    color: "white",

                    "&:hover": { bgcolor: "primary.dark" },

                    "&.Mui-disabled": { bgcolor: "action.disabledBackground" }

                }}

            >

                <SendIcon fontSize="small" />

            </IconButton>

        </Box>

    );

}

export default ChatInput;