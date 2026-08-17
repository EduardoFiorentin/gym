import type { ExercicioDTO } from "./Exercicio.dto";

export interface TreinoDetailsDTO {
    id: string,
    name: string,
    exercicios: ExercicioDTO[]
}
