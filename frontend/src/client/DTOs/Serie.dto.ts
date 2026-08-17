import type { ExercicioDTO } from "./Exercicio.dto";
import type { TreinamentoDTO } from "./Treinamento.dto";

export interface SerieDTO {
    id: string,
    magnitude: number,
    execucoes: number,
    createdAt: string,
    treinamento: TreinamentoDTO, 
    exercicio: ExercicioDTO 

}
