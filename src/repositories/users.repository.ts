import {UserEntity} from "../entities/user.entity";
import {db} from "../index";
import {UserViewModel} from "../viewModels/user.view.model";
import {UpdateUserDto} from "../dto/update.user.dto";

export class UsersRepository {

    async saveUser(user: UserEntity): Promise<void> {
        await db.query(`INSERT INTO public."Users"(
            "id", "login","email","password","createAt")
            VALUES ($1,$2,$3,$4,$5)`,
            [user.id, user.login, user.email, user.password, user.createAt],
        );
    }

    async getUserById(userId: string): Promise<UserViewModel | null> {
        return db.oneOrNone(`SELECT id, email, login, "createAt", role, "updateAt" FROM public."Users" WHERE id=$1`, [userId])
    }

    async getUserByEmail(email: string): Promise<UserViewModel | null> {
        return db.oneOrNone(`SELECT * FROM public."Users" WHERE email=$1`, [email])
    }

    async updateUser(body: UpdateUserDto, userId: string) {
        await db.query(`UPDATE public."Users"
            SET login=$1,email=$2, password=$3
            WHERE id=$4`, [body.login, body.email, body.password, userId]);
    }

    async deleteUser(userId: string) {
        return db.query(`DELETE FROM public."Users" WHERE id=$1`, [userId])
    }

    async getAllUsers() {
        return db.query(`SELECT id, email, login, "createAt", role, "updateAt" FROM public."Users"`)
    }
}