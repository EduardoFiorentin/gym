import type { TreinamentoDetailsDTO } from "../client/DTOs/TreinamentoDetails.dto";
import type { SerieDetailsModel } from "../models/SerieDetails.model";
import type { TreinamentoDetailsModel } from "../models/TreinamentoDetails.model";
import { TreinoConverter } from "./treino.converter";

export const TreinamentoDetailsConverter = {
    toModel: (treinamentoDto: TreinamentoDetailsDTO): TreinamentoDetailsModel => {
        return {
            id: treinamentoDto.id,
            startedAt: new Date(treinamentoDto.startedAt),
            finishedAt: treinamentoDto.finishedAt ? new Date(treinamentoDto.finishedAt) : null,
            treino: TreinoConverter.toDetailsModel(treinamentoDto.treino),
            series: treinamentoDto.series.map((serie): SerieDetailsModel => ({
                id: serie.id,
                exercicioId: serie.exercicioId,
                magnitude: serie.magnitude,
                execucoes: serie.execucoes,
                createdAt: new Date(serie.createdAt)
            }))
        }
    }
}
