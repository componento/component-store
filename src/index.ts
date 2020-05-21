import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import path from "path";

const app = new Koa();
const router = new Router();
const koaBody = require("koa-body")({multipart:true});
const koaStatic = require('koa-static')
const fs = require("fs");
const os = require('os');

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

// Upload File to server API
router.post("/upload", koaBody,async ctx => {
    const file_name = ctx.request.body.files.foo.name;
    const file_path = ctx.request.body.files.foo.path;

    if(!file_name) {
        console.log("There was an error")
        ctx.response.redirect("/");
    }
    else {
        const reader = fs.createReadStream(file_path);
        console.log(path.join("static/uploads/", Math.random().toString()));
        const stream = fs.createWriteStream(path.join("static/uploads/", Math.random().toString()));
        reader.pipe(stream);
        console.log('uploading %s -> %s', file_name, stream.path);
        ctx.redirect('/');
        ctx.res.statusCode = 200;
    }
});

// Update File to server API
router.put("/update", koaBody,async ctx => {
    const file_name = ctx.request.body.files.foo.name;
    const file_path = ctx.request.body.files.foo.path;

    if(!file_name) {
        console.log("There was an error")
        ctx.response.redirect("/");
    }
    else {
        const reader = fs.createReadStream(file_path);
        const stream = fs.createWriteStream(path.join("static/uploads/", file_name));
        reader.pipe(stream);
        console.log('uploading %s -> %s', file_name, stream.path);
        ctx.res.statusCode = 200;
    }
});


// Remmove api
router.put("/delete", koaBody,async ctx => {
    const file = ctx.request.query.file;
    console.log(file);
    const __dirname = path.join('static/uploads',file);
    fs.unlink(__dirname, function (err: any) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    });
    ctx.body = "File are been removed";
    ctx.res.statusCode = 200;

});

//List All Components
router.get("/list_components", async (ctx, next) => {
    const testFolder = './static/uploads/';
    fs.readdir(testFolder, (err: any, files: any[]) => {
        files.forEach(file => {
            console.log('files:', files);
        });
    });
    ctx.res.statusCode = 200;
});

// View Details
router.get("/view_details", async (ctx, next) => {
    const testFolder = './static/uploads/';
    fs.readdir(testFolder, (err: any, files: any[]) => {
        files.forEach(file => {
            console.log('files:', files);
            console.log('files:', files);
            console.log('files:', files);
        });
    });
    ctx.res.statusCode = 200;
});

app.use(router.routes());
app.use(router.allowedMethods());

