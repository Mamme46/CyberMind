import {

    Box,

    Button,

    TextField

} from "@mui/material";

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

                gap: 2,

                p: 2,

                borderTop: "1px solid #ddd"

            }}

        >

            <TextField

                fullWidth

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

            <Button

                variant="contained"

                onClick={send}

            >

                Send

            </Button>

        </Box>

    );

}

export default ChatInput;