import type { SerieDetailsModel } from "./SerieDetails.model";
import type { TreinoDetailsModel } from "./TreinoDetails.model";

export interface TreinamentoDetailsModel {
    id: string,
    startedAt: Date,
    finishedAt: Date | null,
    treino: TreinoDetailsModel,
    series: SerieDetailsModel[]
}
