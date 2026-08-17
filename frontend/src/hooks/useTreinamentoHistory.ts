import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ITreinamentoHistoryModel } from "../models/TreinamentoHistory.model"
import { STORAGE_KEYS } from "../utils/constants/storageKeys/storageKeys"
import { TIME_CONSTANTS_MILLIS } from "../utils/constants/time/constants"
import { TreinamentoClient } from "../client/treinamento.client"

export const useTreinamentoHistory = () => {
    const queryClient = useQueryClient()

    const { data: treinamentoHistory, isLoading: isInitializing } = useQuery<ITreinamentoHistoryModel[]>({
        queryKey: STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST_CACHE_KEY,
        queryFn: async () => TreinamentoClient.getTreinamentosHistoryStartingFrom(),
        staleTime: TIME_CONSTANTS_MILLIS.ONE_WEEK
    })

    const treinamentoHistoryMutation = useMutation({
        mutationFn: () => TreinamentoClient.getTreinamentosHistoryStartingFrom(),
        onSuccess: (data: ITreinamentoHistoryModel[]) => {
            queryClient.setQueryData(STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST_CACHE_KEY, data);
        }
    })

    return {
        treinamentoHistory,
        isInitializing,
        updateStartingFrom: treinamentoHistoryMutation.mutateAsync,
        isLoading: treinamentoHistoryMutation.isPending,
        error: treinamentoHistoryMutation.error
    }
}
