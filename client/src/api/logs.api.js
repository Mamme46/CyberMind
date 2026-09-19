import api from "./api";

function authHeader() {

    return {

        Authorization: `Bearer ${localStorage.getItem("token")}`

    };

}

export async function getUploadLogs(uploadId) {

    const response = await api.get(

        `/logs/${uploadId}`,

        {

            headers: authHeader()

        }

    );

    return response.data.data;

}
