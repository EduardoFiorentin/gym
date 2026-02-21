import type { SerieDTO } from "../client/DTOs/Serie.dto";
import type { SerieModel } from "../models/Serie.model";

export const SerieConverter = {
    toModel: (serieDto: SerieDTO) => {
        const model: SerieModel = {
            execucoes: serieDto.execucoes,
            exercicio: serieDto.exercicio,
            magnitude: serieDto.magnitude
        }
        return model
    },
    // toDto: (serieModel: SerieModel) => {
    //     const dto: SerieDTO = {

    //     }
    //     return dto;
    // }
}   