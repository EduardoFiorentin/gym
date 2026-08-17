import type { UnMedidaDTO } from "./UnMedida.dto";

export interface ExercicioDTO {
    id: string,
    name: string,
    active: boolean,
    inativatedAt: Date|null,
    createdAt: Date,
    updatedAt: Date|null,
    unMedida: UnMedidaDTO
}
