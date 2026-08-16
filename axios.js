import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7000/api",
    timeout: 120000
});

api.interceptors.response.use(

    response => response,

    error => {

        console.error("API ERROR");

        console.error(error);

        return Promise.reject(error);

    }

);

export default api;