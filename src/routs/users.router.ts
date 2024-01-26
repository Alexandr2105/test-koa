import Router from "koa-router";
import {UsersController} from "../controllers/users.controller";
import {UsersRepository} from "../repositories/users.repository";
import {MiddlewareController} from "../middlewares/middleware.controller";

export const usersRouter = new Router({prefix: "/users"});
const usersController = new UsersController();
const middlewareController = new MiddlewareController();
const usersRepository = new UsersRepository();

const checkUserId = async (ctx: any, next: any) => {
    const userId = ctx.params.userId;
    const user = await usersRepository.getUserById(userId);
    if (!user) {
        ctx.status = 404;
        return;
    }
    await next();
}

const checkIsForbidden = async (ctx: any, next: any) => {
    const paramUserId = ctx.params.userId;
    const originUserId = ctx.user.id;
    if (paramUserId !== originUserId) {
        ctx.status = 403;
        return;
    }
    await next();
}

const checkEmailInDB = async (ctx: any, next: any) => {
    const email = ctx.request.body.email;
    const paramUserId = ctx.params.userId;
    const emailExists = await usersRepository.getUserByEmail(email);
    if (emailExists && paramUserId === emailExists.id) {
        await next()
    } else ctx.throw(400, "Email already exists in the database");
}


usersRouter.get("/", usersController.getAllUsers.bind(usersController));
usersRouter.get("/:userId", checkUserId, usersController.getUser.bind(usersController));
usersRouter.put("/:userId", middlewareController.checkToken.bind(middlewareController), checkUserId, checkIsForbidden, checkEmailInDB, middlewareController.checkPassword,
    middlewareController.checkEmail, middlewareController.checkLogin, middlewareController.generalMiddleware, usersController.updateUser.bind(usersController));
usersRouter.delete("/:userId", middlewareController.checkToken.bind(middlewareController), checkUserId, checkIsForbidden, middlewareController.generalMiddleware,
    usersController.deleteUser.bind(usersController));