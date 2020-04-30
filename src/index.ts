import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";

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

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log(`Koa started on port ${PORT}`);
});
