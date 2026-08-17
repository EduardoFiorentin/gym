import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ITreinamentoHistoryModel } from "../models/TreinamentoHistory.model"
import { STORAGE_KEYS } from "../utils/constants/storageKeys/storageKeys"
import { TIME_CONSTANTS_MILLIS } from "../utils/constants/time/constants"
import { TreinamentoClient } from "../client/treinamento.client"

const getCachedTreinamentoHistory = () => {
    const cachedTreinamentos = localStorage.getItem(STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST)
    if (!cachedTreinamentos) {
        return []
    }

    try {
        const parsed: ITreinamentoHistoryModel[] = JSON.parse(cachedTreinamentos)
        
        // when parsing, internal Date objects keep in his string annotation
        // To use them as a Date object, is necessary to convert them 
        parsed.forEach(th => {
            th.startedAt = new Date(th.startedAt)
            th.finishedAt = th.finishedAt ? new Date(th.finishedAt) : null
        })

        return parsed || []
    }
    catch {
        localStorage.removeItem(STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST);
        return [];
    }

}


export const useTreinamentoHistory = () => {
    const queryClient = useQueryClient()

    const { data: treinamentoHistory, isLoading: isInitializing } = useQuery<ITreinamentoHistoryModel[]>({
        queryKey: STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST_CACHE_KEY,
        placeholderData: getCachedTreinamentoHistory,
        queryFn: async () => TreinamentoClient.getTreinamentosHistoryStartingFrom(),
        staleTime: TIME_CONSTANTS_MILLIS.ONE_WEEK
    })

    const treinamentoHistoryMutation = useMutation({
        mutationFn: () => TreinamentoClient.getTreinamentosHistoryStartingFrom(),
        onSuccess: (data: ITreinamentoHistoryModel[]) => {
            localStorage.setItem(STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST, JSON.stringify(data));
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
