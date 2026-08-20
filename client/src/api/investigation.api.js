import api from "./api";

export async function getInvestigation(alertId) {

    const token = localStorage.getItem("token");

    const response = await api.get(

        `/investigations/${alertId}`,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data.data;
}