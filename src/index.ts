import Koa from "koa";
import Router from "koa-router";
import pgPromise from 'pg-promise';
import {settings} from "./settings";
import {authRouter} from "./routs/auth.router";
import bodyParser from "koa-bodyparser";
import {UserEntity} from "./entities/user.entity";
import {usersRouter} from "./routs/users.router";

export const app = new Koa();
app.use(bodyParser());
require('koa-validate')(app);

const router = new Router();

const dbConfig = {
    user: settings.POSTGRES_USERNAME,
    host: settings.POSTGRES_HOST,
    database: settings.POSTGRES_DATABASE,
    password: settings.POSTGRES_PASSWORD,
    port: +settings.POSTGRES_PORT,
    ssl: true,
};

const pgp = pgPromise();
export const db = pgp(dbConfig);

router.get("/", async (ctx, next) => {
    ctx.body = 'Hello World';
})

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(usersRouter.routes());
app.use(usersRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(settings.PORT, () => {
    console.log(`Server is running on http://localhost:${settings.PORT}`);
});