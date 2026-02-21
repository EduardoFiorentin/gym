import type { TreinoDTO } from "./Treino.dto";

export interface TreinamentoDTO {
    id: string,
    treino: TreinoDTO,
    startedAt: Date,
    finishedAt: Date | null
}