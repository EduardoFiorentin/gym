import { useQuery } from "@tanstack/react-query";
import { TreinamentoClient } from "../client/treinamento.client";
import type { PreviousExercisePerformanceModel } from "../models/PreviousExercisePerformance.model";
import { STORAGE_KEYS } from "../utils/constants/storageKeys/storageKeys";

export const usePreviousExercisePerformance = (
    exercicioId?: string,
    trainingContextId?: string,
    enabled = true
) => {
    const previousPerformanceQuery = useQuery<PreviousExercisePerformanceModel | null>({
        queryKey: [
            STORAGE_KEYS.PREVIOUS_EXERCISE_PERFORMANCE_CACHE_KEY,
            exercicioId,
            trainingContextId
        ],
        queryFn: () => TreinamentoClient.getPreviousExercisePerformance(exercicioId!),
        enabled: enabled && Boolean(exercicioId && trainingContextId),
        retry: false
    });

    return {
        previousPerformance: previousPerformanceQuery.data,
        isLoading: previousPerformanceQuery.isLoading,
        isFetching: previousPerformanceQuery.isFetching,
        isFetched: previousPerformanceQuery.isFetched,
        error: previousPerformanceQuery.error,
        refetch: previousPerformanceQuery.refetch
    }
}
