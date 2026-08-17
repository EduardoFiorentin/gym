import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TreinamentoClient } from "../client/treinamento.client";
import type { TreinamentoDetailsModel } from "../models/TreinamentoDetails.model";
import { STORAGE_KEYS } from "../utils/constants/storageKeys/storageKeys";

export const useTreinamentoDetails = (treinamentoId?: string, enabled = true) => {
    const detailsQuery = useQuery<TreinamentoDetailsModel>({
        queryKey: [STORAGE_KEYS.TREINAMENTO_DETAILS_CACHE_KEY, treinamentoId],
        queryFn: () => TreinamentoClient.getTreinamentoDetails(treinamentoId!),
        enabled: enabled && Boolean(treinamentoId),
        retry: false
    });

    return {
        treinamentoDetails: detailsQuery.data,
        isLoading: detailsQuery.isLoading,
        isFetching: detailsQuery.isFetching,
        error: detailsQuery.error,
        isNotFound: axios.isAxiosError(detailsQuery.error) && detailsQuery.error.response?.status === 404,
        refetch: detailsQuery.refetch
    }
}
