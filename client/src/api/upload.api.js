import api from "./api";

function authHeader() {

    return {

        Authorization: `Bearer ${localStorage.getItem("token")}`

    };

}

export async function getUploads() {

    const response = await api.get(

        "/uploads",

        {

            headers: authHeader()

        }

    );

    return response.data.data;

}

export async function getUpload(id) {

    const response = await api.get(

        `/uploads/${id}`,

        {

            headers: authHeader()

        }

    );

    return response.data.data;

}

export async function uploadLog(file) {

    const formData = new FormData();

    formData.append("log", file);

    const response = await api.post(

        "/uploads",

        formData,

        {

            headers: authHeader()

        }

    );

    return response.data;

}