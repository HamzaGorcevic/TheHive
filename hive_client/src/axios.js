import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

axiosClient.interceptors.request.use((config) => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    if (authData?.token) {
        config.headers.Authorization = `Bearer ${authData.token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        try {
            const { response } = error;
            if (response.status === 401) {
                localStorage.removeItem("authData");
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }
        throw error;
    }
);

export default axiosClient;
