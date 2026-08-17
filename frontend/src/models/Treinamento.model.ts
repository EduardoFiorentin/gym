export interface TreinamentoModel {
    id: string,
    treinoId: string,
    treinoName: string,
    startedAt: Date,
    finishedAt: Date | null
}
