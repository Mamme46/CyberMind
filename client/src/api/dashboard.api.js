import api from "./api";

export async function getDashboardStats() {

    const token = localStorage.getItem("token");

    const response = await api.get("/dashboard/stats", {

        headers: {

            Authorization: `Bearer ${token}`

        }

    });

    return response.data.data;

}

export async function getRecentAlerts() {

    const token = localStorage.getItem("token");

    const response = await api.get("/dashboard/recent-alerts", {

        headers: {

            Authorization: `Bearer ${token}`

        }

    });

    return response.data.data;

}