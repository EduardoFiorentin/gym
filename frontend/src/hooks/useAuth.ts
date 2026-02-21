// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthClient } from "../client/auth.client";
import type { AuthModel } from "../models/AuthModel";
import { TIME_CONSTANTS_MILLIS } from "../utils/constants/time/constants";
import type { LoginCredentialsModel } from "../models/LoginCredentials.model";
import { STORAGE_KEYS } from "../utils/constants/storageKeys/storageKeys";


const getCachedUser = (): AuthModel | null => {
    const cachedAuth = localStorage.getItem(STORAGE_KEYS.AUTH_CACHE_USER_DATA);
    if (!cachedAuth) return null;
    
    try {
        const parsed: AuthModel = JSON.parse(cachedAuth);
        return parsed || null;
    } catch {
        localStorage.removeItem(STORAGE_KEYS.AUTH_CACHE_USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.AUTH_CACHE_TOKEN);
        return null;
    }
};

export const useAuth = () => {
    const queryClient = useQueryClient();

    const { data: userInfo, isLoading: isInitializing } = useQuery<AuthModel | null>({
        queryKey: STORAGE_KEYS.AUTH_CACHE_KEY,
        // O initialData resolve o problema do redirecionamento. 
        // Ele lê o disco antes da primeira renderização.
        initialData: getCachedUser, 
        queryFn: async () => {
            // Só vai rodar se o initialData retornar null ou se o staleTime expirar
            return getCachedUser();
        },
        staleTime: TIME_CONSTANTS_MILLIS.ONE_DAY, 
    });

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentialsModel) => AuthClient.login(credentials),
        onSuccess: (data: AuthModel) => {
            localStorage.setItem(STORAGE_KEYS.AUTH_CACHE_TOKEN, data.token);
            localStorage.setItem(STORAGE_KEYS.AUTH_CACHE_USER_DATA, JSON.stringify(data));
            queryClient.setQueryData(STORAGE_KEYS.AUTH_CACHE_KEY, data.user);
        },
    });

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_CACHE_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTH_CACHE_USER_DATA);
        queryClient.setQueryData(STORAGE_KEYS.AUTH_CACHE_KEY, null);
        queryClient.clear();
    };

    return {
        userInfo: userInfo,
        isInitializing,
        login: loginMutation.mutateAsync, 
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        logout
    };
};