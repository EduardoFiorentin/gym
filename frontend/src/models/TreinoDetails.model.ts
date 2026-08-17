import type { ExercicioModel } from "./Exercicio.model";
import type { TreinoModel } from "./Treino.model";

export interface TreinoDetailsModel extends TreinoModel {
    exercicios: ExercicioModel[]
}
