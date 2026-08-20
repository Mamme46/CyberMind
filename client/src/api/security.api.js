import axios from "axios";

const API_URL = "http://localhost:3000/api/security";

export async function runSecurityScan() {

    const token =
        localStorage.getItem("token");

    const response = await axios.post(

        `${API_URL}/scan`,

        {},

        {
            headers: {

                Authorization:
                    `Bearer ${token}`

            }

        }

    );

    return response.data.data;

}