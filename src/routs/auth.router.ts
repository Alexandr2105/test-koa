import Router from "koa-router";
import {MiddlewareController} from "../middlewares/middleware.controller";
import {AuthController} from "../controllers/auth.controller";
import {UsersRepository} from "../repositories/users.repository";
import {JwtService} from "../servicies/jwt.service";

export const authRouter = new Router({prefix: "/auth"});
const authController = new AuthController();
const middlewareController = new MiddlewareController();
const usersRepository = new UsersRepository();
const jwtService = new JwtService();

const authMiddleWare = async (ctx: any, next: any) => {
    const body = ctx.request.body;
    const user: any = await usersRepository.getUserByEmail(body.email);
    if (!user) {
        ctx.status = 401;
        return;
    }
    const hashPassword = await jwtService.generateHash(body.password, user.password);
    if (user.password === hashPassword) {
        await next();
    } else {
        ctx.status = 401;
    }
}

authRouter.post("/registration", middlewareController.checkLogin, middlewareController.checkEmail, middlewareController.checkEmailIsOriginal.bind(middlewareController),
    middlewareController.checkPassword, middlewareController.generalMiddleware, authController.registration.bind(authController));
authRouter.post("/login", middlewareController.checkEmail, middlewareController.checkPassword, authMiddleWare, middlewareController.generalMiddleware,
    authController.login.bind(authController));
authRouter.get("/me", middlewareController.checkToken.bind(middlewareController), authController.me.bind(authController));
authRouter.get("/secret", middlewareController.checkRole.bind(middlewareController), authController.secret.bind(authController));