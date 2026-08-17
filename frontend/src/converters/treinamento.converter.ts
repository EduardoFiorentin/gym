import type { TreinamentoDTO } from "../client/DTOs/Treinamento.dto";
import type { TreinamentoModel } from "../models/Treinamento.model";

export const TreinamentoConverter = {
    toModel: (treinamentoDto: TreinamentoDTO): TreinamentoModel => {
        return {
            id: treinamentoDto.id,
            treinoId: treinamentoDto.treinoId,
            treinoName: treinamentoDto.treinoName,
            startedAt: new Date(treinamentoDto.startedAt),
            finishedAt: treinamentoDto.finishedAt ? new Date(treinamentoDto.finishedAt) : null
        }
    }
}
