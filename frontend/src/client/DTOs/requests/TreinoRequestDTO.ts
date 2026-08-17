import type { ExercicioRequestDTO } from "./ExercicioRequestDTO";

export interface TreinoRequestDTO {
    name: string,
    exercicios: ExercicioRequestDTO[]
}
