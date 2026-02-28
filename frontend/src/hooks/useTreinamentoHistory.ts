import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ITreinamentoHistoryModel } from "../models/TreinamentoHistory.model"
import { STORAGE_KEYS } from "../utils/constants/storageKeys/storageKeys"
import { TIME_CONSTANTS_MILLIS } from "../utils/constants/time/constants"
import { TreinamentoClient } from "../client/treinamento.client"

STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST

const getCachedTreinamentoHistory = () => {
    const cachedTreinamentos = localStorage.getItem(STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST)
    if (!cachedTreinamentos) {
        console.log("Historico de treinamentos local não encontrado.")
        return []
    }

    try {
        const parsed: ITreinamentoHistoryModel[] = JSON.parse(cachedTreinamentos)
        
        // when parsing, internal Date objects keep in his string annotation
        // To use them as a Date object, is necessary to convert them 
        parsed.map(th => {
            th.startedAt = new Date(th.startedAt)
            th.finishedAt = new Date(th.finishedAt)
        })

        console.log("Historico de treinamentos local encontrado.", parsed)
        return parsed || []
    }
    catch {
        console.log("Um erro ocorreu no parsing do histórico de treinamentos.")
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