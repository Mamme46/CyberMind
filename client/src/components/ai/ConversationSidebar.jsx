import {

    Box,

    Typography,

    Button,

    Divider,

    List,

    ListItemButton,

    ListItemText,

    IconButton

} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import AddIcon from "@mui/icons-material/Add";

import EmptyState from "../common/EmptyState";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

function ConversationSidebar({

    conversations,

    selectedConversation,

    onSelect,

    onNewConversation,

    onDelete

}) {

    return (

        <Box

            sx={{

                width: 280,

                height: "100%",

                borderRight: "1px solid",

                borderColor: "divider",

                display: "flex",

                flexDirection: "column",

                bgcolor: "#fafafa"

            }}

        >

            <Box sx={{ p: 2 }}>

                <Button

                    fullWidth

                    variant="contained"

                    startIcon={<AddIcon />}

                    onClick={onNewConversation}

                >

                    New Chat

                </Button>

            </Box>

            <Divider />

            <Typography

                variant="overline"

                sx={{

                    px: 2,

                    pt: 2,

                    pb: 1,

                    color: "text.secondary"

                }}

            >

                Conversations

            </Typography>

            <List

                sx={{

                    flex: 1,

                    overflowY: "auto",

                    px: 1

                }}

            >

                {

                    conversations.length === 0 && (

                        <EmptyState

                            icon={<ChatBubbleOutlineIcon />}

                            title="No conversations yet"

                            description="Start a new chat to talk with the CyberMind AI assistant."

                        />

                    )

                }

                {

                    conversations.map(conversation => (

                        <ListItemButton

                            key={conversation.id}

                            selected={

                                selectedConversation?.id ===

                                conversation.id

                            }

                            onClick={() =>

                                onSelect(conversation)

                            }

                            sx={{

                                borderRadius: 2,

                                mb: 0.5

                            }}

                        >

                            <ListItemText

                                primary={conversation.title}

                                secondary={

                                    new Date(

                                        conversation.updated_at

                                    ).toLocaleString()

                                }

                                slotProps={{

                                    primary: {

                                        noWrap: true,

                                        fontSize: 14

                                    },

                                    secondary: {

                                        fontSize: 12

                                    }

                                }}

                            />

                            <IconButton

                                color="error"

                                onClick={(e)=>{

                                    e.stopPropagation();

                                    onDelete(

                                        conversation.id

                                    );

                                }}

                            >

                                <DeleteIcon/>

                            </IconButton>

                        </ListItemButton>

                    ))

                }

            </List>

        </Box>

    );

}

export default ConversationSidebar;