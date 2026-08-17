import type { SerieDetailsDTO } from "./SerieDetails.dto";

export interface PreviousExercisePerformanceDTO {
    treinamentoId: string,
    exercicioId: string,
    startedAt: string,
    finishedAt: string,
    series: SerieDetailsDTO[]
}
