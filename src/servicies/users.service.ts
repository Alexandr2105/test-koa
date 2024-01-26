import {RegistrationDto} from "../dto/registration.dto";
import {UserEntity} from "../entities/user.entity";
import {UsersRepository} from "../repositories/users.repository";
import {JwtService} from "./jwt.service";
import {UserViewModel} from "../viewModels/user.view.model";
import {LoginDto} from "../dto/login.dto";
import bcrypt from "bcrypt";

export class UsersService {
    usersRepository = new UsersRepository();
    jwtService = new JwtService();

    async registrationNewUser(body: RegistrationDto): Promise<UserViewModel | false> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this.jwtService.generateHash(body.password, passwordSalt);
        const user: UserEntity = {
            id: +new Date() + "",
            login: body.login,
            password: passwordHash,
            email: body.email,
            createAt: new Date().toISOString(),
        }
        await this.usersRepository.saveUser(user);
        const userInfo = await this.usersRepository.getUserById(user.id);
        if (userInfo) {
            return userInfo;
        } else {
            return false;
        }
    }

    async loginUser(body: LoginDto) {
        const userInfo = await this.usersRepository.getUserByEmail(body.email);
        if (userInfo) {
            const jwtToken = this.jwtService.creatJWT(userInfo);
            const jwtRefreshToken = this.jwtService.creatRefreshJWT(userInfo);
            return {jwtToken, jwtRefreshToken}
        } else {
            return false;
        }
    }

    async getUsers() {
        return this.usersRepository.getAllUsers();
    }

    async getUserById(userId: string): Promise<UserViewModel | null> {
        return this.usersRepository.getUserById(userId);
    }

    async updateUser(body: RegistrationDto, userId: string): Promise<void> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this.jwtService.generateHash(body.password, passwordSalt);
        return this.usersRepository.updateUser({...body, password: passwordHash}, userId);
    }

    async deleteUser(userId: string): Promise<void> {
        return this.usersRepository.deleteUser(userId);
    }
}