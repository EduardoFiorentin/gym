import type { ExercicioModel } from "./Exercicio.model";

export interface SerieModel {
    magnitude: number,
    execucoes: BigInteger,
    exercicio: ExercicioModel
}