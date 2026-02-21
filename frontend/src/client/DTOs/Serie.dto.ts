import type { ExercicioDTO } from "./Exercicio.dto";
import type { TreinamentoDTO } from "./Treinamento.dto";

export interface SerieDTO {
    id: string,
    magnitude: number,
    execucoes: BigInteger,
    createdAt: Date,
    treinamento: TreinamentoDTO, 
    exercicio: ExercicioDTO 

}