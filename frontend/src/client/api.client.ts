// client/api.client.ts
import axios, { type InternalAxiosRequestConfig } from 'axios';

const XSRF_COOKIE_NAME = 'XSRF-TOKEN';
const XSRF_HEADER_NAME = 'X-XSRF-TOKEN';
const UNSAFE_METHODS = new Set(['post', 'put', 'patch', 'delete']);

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const csrfApi = axios.create({
    baseURL,
    timeout: 5000,
    withCredentials: true,
});

let csrfTokenRequest: Promise<void> | null = null;

const hasCsrfCookie = (): boolean => {
    if (typeof document === 'undefined') return false;

    return document.cookie
        .split(';')
        .some((cookie) => cookie.trim().startsWith(`${XSRF_COOKIE_NAME}=`));
};

const ensureCsrfToken = async (): Promise<void> => {
    if (typeof document === 'undefined' || hasCsrfCookie()) return;

    if (!csrfTokenRequest) {
        csrfTokenRequest = csrfApi.get('/auth/csrf')
            .then(() => undefined)
            .finally(() => {
                csrfTokenRequest = null;
            });
    }

    await csrfTokenRequest;
};

export const api = axios.create({
    baseURL,
    timeout: 5000,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: XSRF_COOKIE_NAME,
    xsrfHeaderName: XSRF_HEADER_NAME,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toLowerCase();

    if (method && UNSAFE_METHODS.has(method)) {
        await ensureCsrfToken();
    }

    return config;
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
