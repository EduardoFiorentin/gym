// client/api.client.ts
import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants/storageKeys/storageKeys';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_CACHE_TOKEN);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error("Erro de comunicação com o servidor.", error);
        }
        return Promise.reject(error);
    }
);