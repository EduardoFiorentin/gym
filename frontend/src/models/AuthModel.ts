import type { UserModel } from "./User.model";

export interface AuthModel {
    token: string,
    user: UserModel
}