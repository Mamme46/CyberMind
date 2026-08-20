import {

    Box

} from "@mui/material";

import MessageBubble from "./MessageBubble";

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

                messages.map((message, index) => (

                    <MessageBubble

                        key={index}

                        role={message.role}

                        content={message.content}

                    />

                ))

            }

        </Box>

    );

}

export default ChatWindow;