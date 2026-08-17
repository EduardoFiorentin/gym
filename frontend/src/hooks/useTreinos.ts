import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TreinoClient } from "../client/treino.client";
import type { TreinoRequestDTO } from "../client/DTOs/requests/TreinoRequestDTO";
import type { TreinoModel } from "../models/Treino.model";
import type { TreinoDetailsModel } from "../models/TreinoDetails.model";
import { STORAGE_KEYS } from "../utils/constants/storageKeys/storageKeys";
import { TIME_CONSTANTS_MILLIS } from "../utils/constants/time/constants";

export const useTreinos = () => {
    const queryClient = useQueryClient();

    const treinosQuery = useQuery<TreinoModel[]>({
        queryKey: STORAGE_KEYS.TREINOS_LIST_CACHE_KEY,
        queryFn: TreinoClient.getTreinos,
        staleTime: TIME_CONSTANTS_MILLIS.ONE_DAY
    });

    const createTreinoMutation = useMutation({
        mutationFn: (payload: TreinoRequestDTO) => TreinoClient.createTreino(payload),
        onSuccess: (createdTreino: TreinoDetailsModel) => {
            queryClient.setQueryData<TreinoModel[]>(STORAGE_KEYS.TREINOS_LIST_CACHE_KEY, (current) => {
                return [...(current || []), { id: createdTreino.id, name: createdTreino.name }];
            });
        }
    });

    return {
        treinos: treinosQuery.data || [],
        isLoading: treinosQuery.isLoading,
        error: treinosQuery.error,
        reload: treinosQuery.refetch,
        createTreino: createTreinoMutation.mutateAsync,
        isCreating: createTreinoMutation.isPending,
        createError: createTreinoMutation.error
    }
}
