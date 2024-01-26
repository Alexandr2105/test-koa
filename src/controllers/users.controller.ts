import Koa from "koa";
import {UsersService} from "../servicies/users.service";

export class UsersController {
    usersService = new UsersService();

    async getAllUsers(ctx: Koa.Context): Promise<void> {
        ctx.body = await this.usersService.getUsers();
    }

    async getUser(ctx: Koa.Context): Promise<void> {
        const userId = ctx.params.userId;
        ctx.body = await this.usersService.getUserById(userId);
    }

    async updateUser(ctx: Koa.Context): Promise<void> {
        const body: any = ctx.request.body;
        const userId = ctx.params.userId;
        ctx.status = 204;
        await this.usersService.updateUser(body, userId);
    }

    async deleteUser(ctx: Koa.Context) {
        const userId = ctx.params.userId;
        await this.usersService.deleteUser(userId);
        ctx.status = 204;
    }
}