// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthClient } from "../client/auth.client";
import type { AuthModel } from "../models/AuthModel";
import { TIME_CONSTANTS_MILLIS } from "../utils/constants/time/constants";
import type { LoginCredentialsModel } from "../models/LoginCredentials.model";
import { STORAGE_KEYS } from "../utils/constants/storageKeys/storageKeys";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const authQueryKey = STORAGE_KEYS.AUTH_CACHE_KEY;

    const { data: userInfo, isLoading: isInitializing, error: authError, refetch: refetchUserInfo } = useQuery<AuthModel | null>({
        queryKey: authQueryKey,
        queryFn: AuthClient.me,
        retry: false,
        staleTime: TIME_CONSTANTS_MILLIS.ONE_DAY,
    });

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentialsModel) => AuthClient.login(credentials),
        onSuccess: (data: AuthModel) => {
            queryClient.setQueryData(authQueryKey, data);
        },
    });

    const logout = async () => {
        try {
            await AuthClient.logout();
        } finally {
            queryClient.clear();
            queryClient.setQueryData(authQueryKey, null);
        }
    };

    return {
        userInfo,
        isInitializing,
        login: loginMutation.mutateAsync, 
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        authError,
        refetchUserInfo,
        logout
    };
};
