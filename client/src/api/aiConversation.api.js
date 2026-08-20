import api from "./api";

function authHeader() {

    return {

        Authorization: `Bearer ${localStorage.getItem("token")}`

    };

}

export async function getConversations() {

    const response = await api.get(

        "/ai/conversations",

        {

            headers: authHeader()

        }

    );

    return response.data.data;

}

export async function createConversation() {

    const response = await api.post(

        "/ai/conversations",

        {},

        {

            headers: authHeader()

        }

    );

    return response.data.data;

}

export async function getConversation(id) {

    const response = await api.get(

        `/ai/conversations/${id}`,

        {

            headers: authHeader()

        }

    );

    return response.data.data;

}

export async function deleteConversation(id) {

    await api.delete(

        `/ai/conversations/${id}`,

        {

            headers: authHeader()

        }

    );

}