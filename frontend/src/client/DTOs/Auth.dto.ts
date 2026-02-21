import type { UserDTO } from "./User.dto"

export interface AuthDTO {
    user: UserDTO,
    token: string
}