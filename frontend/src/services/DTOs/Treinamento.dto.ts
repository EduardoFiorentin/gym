import type { TreinoDTO } from "./Treino.dto";

export interface TreinamentoDTO {
    id: String,
    treino: TreinoDTO,
    startedAt: Date,
    finishedAt: Date | null
}