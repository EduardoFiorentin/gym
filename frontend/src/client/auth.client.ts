import { AuthConverter } from "../converters/auth.converter";
import type { AuthModel } from "../models/AuthModel";
import { ERROR_MESSAGES } from "../utils/constants/messages/error";
import { api } from "./api.client";
import type { AuthDTO } from "./DTOs/Auth.dto";
import type { LoginCredentialsDTO } from "./DTOs/LoginCredentials.dto";


export const AuthClient = {
    login: async (credentials: LoginCredentialsDTO): Promise<AuthModel> => {
        try {
            const response = await api.post<AuthDTO>('/auth/login', credentials);
            return AuthConverter.toModel(response.data);
            
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                throw new Error("Credenciais inválidas");
            } else {
                throw new Error(`Erro desconhecido ao efetuar login. ${ERROR_MESSAGES.PERSIST_PROBLEM}`);
            }
        }
    },

    me: async (): Promise<AuthModel | null> => {
        try {
            const response = await api.get<AuthDTO>('/auth/me');
            return AuthConverter.toModel(response.data);
        } catch (error: any) {
            if (error.response && [401, 403].includes(error.response.status)) {
                return null;
            }

            throw error;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } catch (error: any) {
            if (!error.response || ![401, 403].includes(error.response.status)) {
                throw error;
            }
        }
    }
};
