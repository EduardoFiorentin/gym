import type { ExercicioModel } from "./Exercicio.model";

export interface SerieModel {
    id: string,
    magnitude: number,
    execucoes: number,
    createdAt: Date,
    exercicio: ExercicioModel
}
