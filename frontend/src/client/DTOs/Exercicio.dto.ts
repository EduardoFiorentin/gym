import type { TreinoDTO } from "./Treino.dto";
import type { UnMedidaDTO } from "./UnMedida.dto";

export interface ExercicioDTO {
    id: string,
    name: string,
    active: Boolean,
    inativatedAt: Date|null,
    createdAt: Date,
    updatedAt: Date|null,
    treino: TreinoDTO,
    unMedida: UnMedidaDTO
}