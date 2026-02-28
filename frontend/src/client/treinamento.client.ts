import { TreinamentoHistoryConverter } from '../converters/treinamentoHistory.converter';
import type { ITreinamentoHistoryModel } from '../models/TreinamentoHistory.model';
import { getDateTimeOneMonthAgo } from '../utils/functions/date/getTimeAgo';
import { api } from './api.client';
import type { ITreinamentoHistoryResquestDTO } from './DTOs/requests/TreinamentoHistoryResquestDTO';


export const TreinamentoClient = {
  getTreinamentosHistoryStartingFrom: async (): Promise<ITreinamentoHistoryModel[]> => {
    const payload = {startFrom: getDateTimeOneMonthAgo()} as ITreinamentoHistoryResquestDTO
    const response = await api.post("/treinos/history", payload);
    return response.data.map(TreinamentoHistoryConverter.toModel)
  }
};