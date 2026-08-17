// client/api.client.ts
import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error("Erro de comunicação com o servidor.", error);
        }
        return Promise.reject(error);
    }
);
