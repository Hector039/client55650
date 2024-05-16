import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://server55650-production.up.railway.app/api/",
    /* proxy: {
        host: "localhost",
        port: 5173
    } */
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error('Server Error:', error.response.data);
        } else if (error.request) {
            console.error('No Response:', error.request);
        } else {
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 