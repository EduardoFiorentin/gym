import type { TreinoModel } from "./Treino.model";

export interface UserModel {
    login: String,
    name: String,
    treinos: TreinoModel[],  // TODO mapear para treino
    token: String 
}