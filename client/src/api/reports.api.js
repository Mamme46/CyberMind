import api from "./api";

function authHeader() {
    return {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
}

export async function getReports() {
    const response = await api.get("/reports", {
        headers: authHeader()
    });

    return response.data.data;
}

export async function getReport(id) {
    const response = await api.get(`/reports/${id}`, {
        headers: authHeader()
    });

    return response.data.data;
}

export async function deleteReport(id) {
    await api.delete(`/reports/${id}`, {
        headers: authHeader()
    });
}

export async function downloadReport(id) {

    const response = await api.get(

        `/reports/${id}/pdf`,

        {

            headers: authHeader(),

            responseType: "blob"

        }

    );

    return response.data;

}