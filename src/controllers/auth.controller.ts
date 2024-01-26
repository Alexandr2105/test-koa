import Koa from "koa";
import {UsersService} from "../servicies/users.service";

export class AuthController {
    usersService = new UsersService();

    async registration(ctx: Koa.Context): Promise<void> {
        const body: any = ctx.request.body;
        ctx.status = 201;
        ctx.body = await this.usersService.registrationNewUser(body);
    }

    async login(ctx: Koa.Context): Promise<void> {
        const body: any = ctx.request.body;
        const tokens = await this.usersService.loginUser(body);
        if (tokens) {
            ctx.cookies.set('refreshToken', tokens.jwtRefreshToken, {
                httpOnly: true,
            });
            ctx.status = 201;
            ctx.body = {accessToken: tokens.jwtToken};
        } else {
            ctx.status = 400;
        }
    }

    async me(ctx: Koa.Context): Promise<void> {
        ctx.body = ctx.user;
    }

    async secret(ctx: Koa.Context): Promise<void> {
        ctx.status = 200;
    }
}