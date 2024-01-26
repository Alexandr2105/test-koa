import {Roles} from "../viewModels/roles";

export type RegistrationDto = {
    login: string;
    email: string;
    password: string;
    role: Roles;
}