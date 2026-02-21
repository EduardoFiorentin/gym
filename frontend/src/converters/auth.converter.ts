import type { AuthDTO } from "../client/DTOs/Auth.dto";
import type { AuthModel } from "../models/AuthModel";

export const AuthConverter = {
    toModel: (authDto: AuthDTO): AuthModel => {
        const authModel: AuthModel = {
            token: authDto.token,
            user: authDto.user // TODO convert to userModel
        }
        return authModel
    },
    toDto: (authModel: AuthModel): AuthDTO => {
        const authDto: AuthDTO = {
            token: authModel.token,
            user: authModel.user // TODO convert to userDto
        }
        return authDto
    }
}