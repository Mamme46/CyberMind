import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    CircularProgress
} from "@mui/material";

import Layout from "../components/layout/Layout";
import ConversationSidebar from "../components/ai/ConversationSidebar";
import ChatWindow from "../components/ai/ChatWindow";
import ChatInput from "../components/ai/ChatInput";

import {
    getConversations,
    createConversation,
    getConversation,
    deleteConversation
} from "../api/aiConversation.api";

import { streamChat } from "../api/ai.api";

function AIAssistant() {

    const [loading, setLoading] = useState(true);

    const [conversations, setConversations] = useState([]);

    const [selectedConversation, setSelectedConversation] = useState(null);

    const [messages, setMessages] = useState([]);

    useEffect(() => {

        loadConversations();

    }, []);

    async function loadConversations() {

        try {

            const data = await getConversations();

            setConversations(data);

            if (data.length > 0) {

                openConversation(data[0]);

            }

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    }

    async function openConversation(conversation) {

        try {

            const data = await getConversation(conversation.id);

            setSelectedConversation(conversation);

            setMessages(data.messages);

        }

        catch (err) {

            console.error(err);

        }

    }

    async function handleNewConversation() {

        try {

            const conversation = await createConversation();

            setConversations(previous => [

                conversation,

                ...previous

            ]);

            setSelectedConversation(conversation);

            setMessages([]);

        }

        catch (err) {

            console.error(err);

        }

    }

    async function handleDeleteConversation(id) {

        try {

            await deleteConversation(id);

            const updated = conversations.filter(

                c => c.id !== id

            );

            setConversations(updated);

            if (selectedConversation?.id === id) {

                setSelectedConversation(null);

                setMessages([]);

            }

        }

        catch (err) {

            console.error(err);

        }

    }

    async function handleSend(message) {

        if (!selectedConversation)

            return;

        setMessages(previous => [

            ...previous,

            {

                role: "user",

                content: message

            },

            {

                role: "assistant",

                content: ""

            }

        ]);

        try {

            let buffer = "";

            await streamChat(

                selectedConversation.id,

                message,

                chunk => {

                    buffer += chunk;

                    const lines = buffer.split("\n");

                    buffer = lines.pop();

                    for (const line of lines) {

                        if (!line.trim())

                            continue;

                        try {

                            const json = JSON.parse(line);

                            if (json.response) {

                                setMessages(previous => {

                                    const copy = [...previous];

                                    copy[copy.length - 1] = {

                                        ...copy[copy.length - 1],

                                        content:

                                            copy[copy.length - 1].content +

                                            json.response

                                    };

                                    return copy;

                                });

                            }

                        }

                        catch {}

                    }

                }

            );

        }

        catch (err) {

            console.error(err);

        }

    }

    if (loading)

        return (

            <Layout>

                <Box

                    sx={{

                        display: "flex",

                        justifyContent: "center",

                        alignItems: "center",

                        height: "70vh"

                    }}

                >

                    <CircularProgress />

                </Box>

            </Layout>

        );

    return (

        <Layout>

            <Paper
                sx={{

                    width: "100%",

                    height: "calc(100vh - 150px)",

                    minWidth: 0,

                    display: "flex",

                    borderRadius: 4,

                    overflow: "hidden"

                }}
            >

                <ConversationSidebar

                    conversations={conversations}

                    selectedConversation={selectedConversation}

                    onSelect={openConversation}

                    onNewConversation={handleNewConversation}

                    onDelete={handleDeleteConversation}

                />

                <Box

                    sx={{

                        flex: 1,

                        display: "flex",

                        flexDirection: "column"

                    }}

                >

                    <ChatWindow

                        messages={messages}

                    />

                    <ChatInput

                        onSend={handleSend}

                    />

                </Box>

            </Paper>

        </Layout>

    );

}

export default AIAssistant;