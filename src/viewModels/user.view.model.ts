import {Roles} from "./roles";

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createAt: string;
    role: Roles;
    updateAt: string;
}