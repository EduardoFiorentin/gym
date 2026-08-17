import type { SerieDetailsModel } from "./SerieDetails.model";

export interface PreviousExercisePerformanceModel {
    treinamentoId: string,
    exercicioId: string,
    startedAt: Date,
    finishedAt: Date,
    series: SerieDetailsModel[]
}
