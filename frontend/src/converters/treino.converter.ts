
import type { TreinoDTO } from "../client/DTOs/Treino.dto";
import type { TreinoModel } from "../models/Treino.model";

export const TreinoConverter = {
    toModel: (treinoDto: TreinoDTO) => {
        const model: TreinoModel = {
            id: treinoDto.id,
            name: treinoDto.name
        }
        return model
    }
}   