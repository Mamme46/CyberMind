import api from "./api";

function authHeader() {

    return {

        Authorization: `Bearer ${localStorage.getItem("token")}`

    };

}

export async function getAlerts() {

    const response = await api.get(

        "/alerts",

        {

            headers: authHeader()

        }

    );

    return response.data.data;

}

export async function updateAlertStatus(id, status) {

    const response = await api.put(

        `/alerts/${id}/status`,

        {

            status

        },

        {

            headers: authHeader()

        }

    );

    return response.data.data;

}