import jwt from 'jsonwebtoken';
import {settings} from "../settings";
import {UserViewModel} from "../viewModels/user.view.model";
import bcrypt from "bcrypt";

export class JwtService {
    creatJWT(user: UserViewModel) {
        return jwt.sign({userId: user.id, role: user.role}, settings.JWT_SECRET, {expiresIn: settings.TOKEN_LIFE});
    };

    creatRefreshJWT(user: UserViewModel) {
        return jwt.sign({
            userId: user.id, role: user.role
        }, settings.REFRESH_TOKEN_SECRET, {expiresIn: settings.REFRESH_TOKEN_LIFE});
    };

    getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET);
            return result.userId;
        } catch (error) {
            return null;
        }
    };

    getUserByRefreshToken(token: string): Object | null {
        try {
            return jwt.verify(token, settings.REFRESH_TOKEN_SECRET);
        } catch (error) {
            return null;
        }
    };

    generateHash(pass: string, salt: string) {
        return bcrypt.hash(pass, salt);
    };
}