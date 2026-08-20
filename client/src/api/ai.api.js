import api from "./api";

export async function streamChat(

    conversationId,

    message,

    onChunk

){

    const token=

        localStorage.getItem("token");

    const response=await fetch(

        "http://localhost:3000/api/ai/chat",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json",

                Authorization:`Bearer ${token}`

            },

            body:JSON.stringify({
                conversationId,

                message

            })

        }

    );

    const reader=

        response.body.getReader();

    const decoder=

        new TextDecoder();

    while(true){

        const {

            done,

            value

        }=await reader.read();

        if(done)

            break;

        onChunk(

            decoder.decode(value)

        );

    }

}

export async function generateReport(alertId) {

    const response = await api.post(

        `/ai/report/${alertId}`,

        {},

        {

            headers: {

                Authorization: `Bearer ${localStorage.getItem("token")}`

            }

        }

    );

    return response.data.report;

}