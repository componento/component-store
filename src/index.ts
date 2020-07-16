import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import componentApiRouter from "./component-api"
import { postgresDB } from '../database/postgres-db';
const Sequelize = require('sequelize')

const app = new Koa();
const router = new Router();

router.get("/", async (ctx, next) => {
    ctx.body = "hello!";
    ctx.res.statusCode = 200
});

// Init Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.use(componentApiRouter.routes());

const PORT = process.env.port || 3000;

// const bootstrap = async () => {
//     await postgresDB();
// };
// bootstrap();

app.listen(PORT, () => {
    const sequelize = new Sequelize('postgres://zawar:zawar123@localhost:5432/Componento')
    console.log(`Koa started on port ${PORT}`);
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch((err: any) => {
            console.error('Unable to connect to the database:', err);
        });
});