import type { TreinamentoHistoryDTO } from "../client/DTOs/TreinamentoHistory.dto";
import type { ITreinamentoHistoryModel } from "../models/TreinamentoHistory.model";

export const TreinamentoHistoryConverter = {
    toModel: (treinamentoDto: TreinamentoHistoryDTO) => {
        const model: ITreinamentoHistoryModel = {
            id: treinamentoDto.id,
            treinoName: treinamentoDto.treinoName,
            finishedAt: treinamentoDto.finishedAt ? new Date(treinamentoDto.finishedAt) : null,
            startedAt: new Date(treinamentoDto.startedAt),
            treinoId: treinamentoDto.treinoId
        }
        return model
    }
}
