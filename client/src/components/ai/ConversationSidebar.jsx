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

                width: 300,

                height: "100%",

                borderRight: "1px solid #ddd",

                display: "flex",

                flexDirection: "column",

                bgcolor: "#fafafa"

            }}

        >

            <Box sx={{ p: 2 }}>

                <Button

                    fullWidth

                    variant="contained"

                    onClick={onNewConversation}

                >

                    + New Chat

                </Button>

            </Box>

            <Divider />

            <Typography

                sx={{

                    p: 2,

                    fontWeight: "bold"

                }}

            >

                Conversations

            </Typography>

            <List

                sx={{

                    flex: 1,

                    overflowY: "auto"

                }}

            >

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

                        >

                            <ListItemText

                                primary={conversation.title}

                                secondary={

                                    new Date(

                                        conversation.updated_at

                                    ).toLocaleString()

                                }

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