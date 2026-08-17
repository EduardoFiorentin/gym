import { TreinoConverter } from "../converters/treino.converter";
import type { TreinoDetailsModel } from "../models/TreinoDetails.model";
import type { TreinoModel } from "../models/Treino.model";
import { api } from "./api.client";
import type { TreinoDetailsDTO } from "./DTOs/TreinoDetails.dto";
import type { TreinoDTO } from "./DTOs/Treino.dto";
import type { TreinoRequestDTO } from "./DTOs/requests/TreinoRequestDTO";

export const TreinoClient = {
    getTreinos: async (): Promise<TreinoModel[]> => {
        const response = await api.get<TreinoDTO[]>("/treinos");
        return response.data.map(TreinoConverter.toModel);
    },

    getTreino: async (treinoId: string): Promise<TreinoDetailsModel> => {
        const response = await api.get<TreinoDetailsDTO>(`/treinos/${treinoId}`);
        return TreinoConverter.toDetailsModel(response.data);
    },

    createTreino: async (payload: TreinoRequestDTO): Promise<TreinoDetailsModel> => {
        const response = await api.post<TreinoDetailsDTO>("/treinos", payload);
        return TreinoConverter.toDetailsModel(response.data);
    }
}
