import {

    Box

} from "@mui/material";

import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

import MessageBubble from "./MessageBubble";

import EmptyState from "../common/EmptyState";

function ChatWindow({ messages }) {

    return (

        <Box

            sx={{

                flex: 1,

                overflowY: "auto",

                p: 3

            }}

        >

            {

                messages.length === 0

                    ? (

                        <EmptyState

                            icon={<SmartToyOutlinedIcon />}

                            title="Start the conversation"

                            description="Ask CyberMind AI about an alert, an investigation or a security concept."

                        />

                    )

                    : (

                        messages.map((message, index) => (

                            <MessageBubble

                                key={index}

                                role={message.role}

                                content={message.content}

                            />

                        ))

                    )

            }

        </Box>

    );

}

export default ChatWindow;