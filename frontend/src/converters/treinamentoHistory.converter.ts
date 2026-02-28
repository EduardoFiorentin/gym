import type { ITreinamentoHistoryDTO } from "../client/DTOs/TreinamentoHistory.dto";
import type { ITreinamentoHistoryModel } from "../models/TreinamentoHistory.model";

export const TreinamentoHistoryConverter = {
    toModel: (treinamentoDto: ITreinamentoHistoryDTO) => {
        const model: ITreinamentoHistoryModel = {
            id: treinamentoDto.id,
            treinoName: treinamentoDto.treinoName,
            finishedAt: new Date(treinamentoDto.finishedAt),
            startedAt: new Date(treinamentoDto.startedAt),
            treinoId: treinamentoDto.treinoId 
        }
        return model
    }
}   