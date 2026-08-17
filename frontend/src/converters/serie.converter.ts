import type { SerieDTO } from "../client/DTOs/Serie.dto";
import type { SerieModel } from "../models/Serie.model";
import { ExercicioConverter } from "./exercicio.converter";

export const SerieConverter = {
    toModel: (serieDto: SerieDTO) => {
        const model: SerieModel = {
            id: serieDto.id,
            execucoes: serieDto.execucoes,
            exercicio: ExercicioConverter.toModel(serieDto.exercicio),
            magnitude: serieDto.magnitude,
            createdAt: new Date(serieDto.createdAt)
        }
        return model
    }
}
