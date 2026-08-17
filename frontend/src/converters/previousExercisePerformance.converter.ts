import type { PreviousExercisePerformanceDTO } from "../client/DTOs/PreviousExercisePerformance.dto";
import type { PreviousExercisePerformanceModel } from "../models/PreviousExercisePerformance.model";
import type { SerieDetailsModel } from "../models/SerieDetails.model";

export const PreviousExercisePerformanceConverter = {
    toModel: (performanceDto: PreviousExercisePerformanceDTO): PreviousExercisePerformanceModel => {
        return {
            treinamentoId: performanceDto.treinamentoId,
            exercicioId: performanceDto.exercicioId,
            startedAt: new Date(performanceDto.startedAt),
            finishedAt: new Date(performanceDto.finishedAt),
            series: performanceDto.series.map((serie): SerieDetailsModel => ({
                id: serie.id,
                exercicioId: serie.exercicioId,
                magnitude: serie.magnitude,
                execucoes: serie.execucoes,
                createdAt: new Date(serie.createdAt)
            }))
        }
    }
}
