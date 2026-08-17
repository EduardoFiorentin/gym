import type { TreinoDTO } from "../client/DTOs/Treino.dto";
import type { TreinoDetailsDTO } from "../client/DTOs/TreinoDetails.dto";
import { ExercicioConverter } from "./exercicio.converter";
import type { TreinoDetailsModel } from "../models/TreinoDetails.model";
import type { TreinoModel } from "../models/Treino.model";

export const TreinoConverter = {
    toModel: (treinoDto: TreinoDTO) => {
        const model: TreinoModel = {
            id: treinoDto.id,
            name: treinoDto.name
        }
        return model
    },
    toDetailsModel: (treinoDto: TreinoDetailsDTO) => {
        const model: TreinoDetailsModel = {
            id: treinoDto.id,
            name: treinoDto.name,
            exercicios: treinoDto.exercicios.map(ExercicioConverter.toModel)
        }
        return model
    }
}
