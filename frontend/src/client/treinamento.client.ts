import { TreinamentoHistoryConverter } from '../converters/treinamentoHistory.converter';
import { SerieConverter } from '../converters/serie.converter';
import { TreinamentoConverter } from '../converters/treinamento.converter';
import type { SerieModel } from '../models/Serie.model';
import type { TreinamentoModel } from '../models/Treinamento.model';
import type { ITreinamentoHistoryModel } from '../models/TreinamentoHistory.model';
import { getDateTimeOneMonthAgo } from '../utils/functions/date/getTimeAgo';
import { api } from './api.client';
import type { SerieDTO } from './DTOs/Serie.dto';
import type { TreinamentoDTO } from './DTOs/Treinamento.dto';
import type { ITreinamentoHistoryResquestDTO } from './DTOs/requests/TreinamentoHistoryResquestDTO';
import type { SerieRequestDTO } from './DTOs/requests/SerieRequestDTO';
import type { SerieUpdateRequestDTO } from './DTOs/requests/SerieUpdateRequestDTO';


export const TreinamentoClient = {
  getTreinamentosHistoryStartingFrom: async (): Promise<ITreinamentoHistoryModel[]> => {
    const payload = {startFrom: getDateTimeOneMonthAgo()} as ITreinamentoHistoryResquestDTO
    const response = await api.post("/treinos/history", payload);
    return response.data.map(TreinamentoHistoryConverter.toModel)
  },

  startTreinamento: async (treinoId: string): Promise<TreinamentoModel> => {
    const response = await api.post<TreinamentoDTO>(`/treinos/${treinoId}/treinamentos`);
    return TreinamentoConverter.toModel(response.data);
  },

  getCurrentTreinamento: async (): Promise<TreinamentoModel | null> => {
    const response = await api.get<TreinamentoDTO | null>('/treinamentos/current');
    if (response.status === 204 || !response.data) return null;
    return TreinamentoConverter.toModel(response.data);
  },

  finishTreinamento: async (treinamentoId: string): Promise<TreinamentoModel> => {
    const response = await api.put<TreinamentoDTO>(`/treinamentos/${treinamentoId}/finish`);
    return TreinamentoConverter.toModel(response.data);
  },

  getSeries: async (treinamentoId: string): Promise<SerieModel[]> => {
    const response = await api.get<SerieDTO[]>(`/treinamentos/${treinamentoId}/series`);
    return response.data.map(SerieConverter.toModel);
  },

  createSerie: async (treinamentoId: string, payload: SerieRequestDTO): Promise<SerieModel> => {
    const response = await api.post<SerieDTO>(`/treinamentos/${treinamentoId}/series`, payload);
    return SerieConverter.toModel(response.data);
  },

  updateSerie: async (treinamentoId: string, serieId: string, payload: SerieUpdateRequestDTO): Promise<SerieModel> => {
    const response = await api.put<SerieDTO>(`/treinamentos/${treinamentoId}/series/${serieId}`, payload);
    return SerieConverter.toModel(response.data);
  },

  deleteSerie: async (treinamentoId: string, serieId: string): Promise<void> => {
    await api.delete<void>(`/treinamentos/${treinamentoId}/series/${serieId}`);
  }
};
