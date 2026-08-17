import type { UnMedidaModel } from "./UnMedida.model";

export interface ExercicioModel {
    id: string,
    name: string,
    active: boolean,
    unMedida: UnMedidaModel
}
