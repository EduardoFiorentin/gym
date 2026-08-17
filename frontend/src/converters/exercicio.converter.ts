import type { ExercicioDTO } from "../client/DTOs/Exercicio.dto";
import type { ExercicioModel } from "../models/Exercicio.model";

export const ExercicioConverter = {
    toModel: (exercicioDto: ExercicioDTO): ExercicioModel => {
        return {
            id: exercicioDto.id,
            name: exercicioDto.name,
            active: exercicioDto.active,
            unMedida: exercicioDto.unMedida
        }
    }
}
