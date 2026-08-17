import type { SerieDetailsDTO } from "./SerieDetails.dto";
import type { TreinoDetailsDTO } from "./TreinoDetails.dto";

export interface TreinamentoDetailsDTO {
    id: string,
    startedAt: string,
    finishedAt: string | null,
    treino: TreinoDetailsDTO,
    series: SerieDetailsDTO[]
}
