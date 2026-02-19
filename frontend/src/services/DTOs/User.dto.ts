export interface UserDTO {
    login: String,
    name: String,
    treinos: Object[],  // TODO mapear para treino
    token: String 
}