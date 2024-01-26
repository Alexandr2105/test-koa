import {UsersRepository} from "../repositories/users.repository";
import {JwtService} from "../servicies/jwt.service";
import {Roles} from "../viewModels/roles";

export class MiddlewareController {
    usersRepository = new UsersRepository();
    jwtService = new JwtService();

    async generalMiddleware(ctx: any, next: any) {
        const errors = ctx.errors;
        if (errors) {
            const errorsMessages = errors.map((e: any) => {
                const field = Object.keys(e)[0];
                const message = e[field];
                return {
                    message: message,
                    field: field,
                }
            });
            ctx.status = 400;
            ctx.body = {errorsMessages};
            return;
        }
        await next();
    }

    async checkToken(ctx: any, next: any) {
        if (!ctx.headers.authorization || ctx.headers.authorization.split(".").length !== 3) {
            ctx.status = 401;
        } else {
            const token = ctx.headers.authorization!.split(" ")[1];
            const userId = await this.jwtService.getUserIdByToken(token);
            if (userId) {
                ctx.user = await this.usersRepository.getUserById(userId.toString());
                if (ctx.user !== null) {
                    await next();
                } else {
                    ctx.status = 401;
                }
            } else {
                ctx.status = 401;
            }
        }
    };

    async checkRole(ctx: any, next: any) {
        if (!ctx.headers.authorization || ctx.headers.authorization.split(".").length !== 3) {
            ctx.status = 401;
        } else {
            const token = ctx.headers.authorization!.split(" ")[1];
            const userId = await this.jwtService.getUserIdByToken(token);
            if (userId) {
                ctx.user = await this.usersRepository.getUserById(userId.toString());
                if (ctx.user?.role === Roles.admin) {
                    await next();
                } else {
                    ctx.status = 403;
                }
            } else {
                ctx.status = 401;
            }
        }
    }

    async checkLogin(ctx: any, next: any) {
        ctx.checkBody('login').trim().notEmpty("The field must not be empty");
        await next();
    };

    async checkEmail(ctx: any, next: any) {
        ctx.checkBody('email').trim().notEmpty("The field must not be empty").isEmail("Your enter a bad email");
        await next();
    };

    async checkPassword(ctx: any, next: any) {
        ctx.checkBody('password').trim().notEmpty("The field must not be empty");
        await next();
    };

    async checkEmailIsOriginal(ctx: any, next: any) {
        const email = ctx.request.body.email;
        const emailExists = await this.usersRepository.getUserByEmail(email);
        if (emailExists) {
            ctx.throw(400, "Email already exists in the database");
        }
        await next();
    }
}