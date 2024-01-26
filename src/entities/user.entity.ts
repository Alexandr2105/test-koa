export class UserEntity {
    id: string;
    login: string;
    email: string;
    password: string;
    createAt: string;


    constructor(id: string, login: string, email: string, password: string, createAt: string) {
        this.id = id;
        this.login = login;
        this.email = email;
        this.password = password;
        this.createAt = createAt;
    }
}