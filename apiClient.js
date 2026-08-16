import axios from "axios";

const apiClient = axios.create({

    baseURL: "http://localhost:7000/api",

    timeout: 120000,

    headers: {

        Accept: "application/json"

    }

});

apiClient.interceptors.response.use(

    response => response,

    error => {

        console.error("========== API ERROR ==========");

        console.error(

            error.response?.data ||

            error.message

        );

        return Promise.reject(error);

    }

);

export default apiClient;