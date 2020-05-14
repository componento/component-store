import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";

const app = new Koa();
const router = new Router();
const koaBody = require("koa-body")({multipart:true});

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


router.post("/upload", koaBody,async ctx => {
    const file = ctx.request;
    console.log(file);
});

// Remmove api
router.put("/delete", koaBody,async ctx => {
    const file = ctx.request.query;
    const base_filename = file['file']
    console.log(base_filename);
    // Add Postgress Functionality Remove from database.
    ctx.body = "File " + base_filename + " has been removed";
    ctx.res.statusCode = 200;

});

app.use(router.routes());
app.use(router.allowedMethods());

