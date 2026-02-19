import type { TreinoModel } from "./Treino.model";

export interface TreinamentoModel {
    treino: TreinoModel,
    startedAt: Date,
    finishedAt: Date | null
}