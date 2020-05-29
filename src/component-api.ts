import Router from "koa-router";
import path from "path";
import {postgresDB} from "../database/postgres-db";

const koaBody = require("koa-body")({multipart:true});
const koaStatic = require('koa-static')
const fs = require("fs");
var tar = require('tar-fs')
const os = require('os');

const router = new Router();

let counter = 0;
let list_of_components: any[];
const testFolder = './static/uploads/';
fs.readdir(testFolder, (err: any, files: any[]) => {
    files.forEach(file => {
        counter = files.length;
        list_of_components = files;
    });
});

// Upload File to server API
router.post("/upload", koaBody,async ctx => {
    const file_name = ctx.request.body.files.foo.name;
    const file_path = ctx.request.body.files.foo.path;
    var ext_name = require('path');
    var ext = path.extname(file_name.toString());


    if(ext == '.tar') {
        if (!file_name) {
            console.log("There was an error")
            ctx.response.redirect("/");
        } else {
            console.log('inside: ',counter);
            const reader = fs.createReadStream(file_path);
            // console.log(path.join("static/uploads/", counter.toString())+".tar");
            const stream = fs.createWriteStream(path.join("static/uploads/", counter.toString())+".tar");
            reader.pipe(stream);
            console.log('uploading %s -> %s', file_name, stream.path);
            ctx.response.redirect('/components/'+ counter);
            ctx.response.header;
            ctx.res.statusCode = 201;
            counter++;
        }
    }
    else{
        ctx.body = "Wrong Extension."
        ctx.res.statusCode = 422;
    }
});

// Update File to server API
router.put("/update", koaBody,async ctx => {
    const file_name = ctx.request.body.files.foo.name;
    const file_path = ctx.request.body.files.foo.path;
    var ext_name = require('path');
    var ext = path.extname(file_name.toString());

    if(ext == '.tar') {
        if (!file_name) {
            console.log("There was an error")
            ctx.response.redirect("/");
        } else {
            const reader = fs.createReadStream(file_path);
            const stream = fs.createWriteStream(path.join("static/uploads/", counter.toString())+".tar");
            reader.pipe(stream);
            console.log('uploading %s -> %s', file_name, stream.path);
            ctx.response.redirect('/components/'+ counter);
            ctx.response.header;
            ctx.res.statusCode = 201;
            counter++;
        }
    }
    else{
        ctx.body = "Wrong Extension."
        ctx.res.statusCode = 422;
    }
});


// Remmove api
router.delete("/delete", koaBody,async ctx => {
    const file_name = ctx.request.query.file;
    console.log(file_name);
    const __dirname = path.join('static/uploads',file_name);

    var ext_name = require('path');
    var ext = path.extname(file_name.toString());

    if(ext == '.tar') {
        fs.unlink(__dirname, function (err: any) {
            if (err) {
                return console.log(err);
            }
            // if no error, file has been deleted successfully
            else {
                console.log('File deleted!');
                ctx.body = "File have been removed";
                ctx.res.statusCode = 200;
            }
        });
    }
    else{
        ctx.body = "Wrong Extension."
        ctx.res.statusCode = 422;
    }

});

//List All Components
router.get("/list_components", async (ctx, next) => {
    ctx.body = {'Components_List' : list_of_components};
    ctx.res.statusCode = 200;
});

const __Uploaddirname = 'static/uploads';
const __Extractdirname = 'static/ext';
var ext_name = require('path');

// View Details
router.get("/view_details", async (ctx, next) => {
    var file_name = ctx.request.query.file;
    var ext = path.extname(file_name.toString());
    const __extpath = path.join(__Extractdirname,file_name.toString(),'sample_component');
    var source = path.join(__Uploaddirname,file_name);
    var target = path.join(__Extractdirname,file_name);
    var someVal = list_of_components.includes(file_name);

    function init() {
        return JSON.parse(fs.readFileSync(path.join(__extpath,fs.readdirSync(__extpath).filter((name:string) => path.extname(name) === '.json')[0])));
    }

    if(ext == '.tar'){
        if (!file_name) {
            ctx.body = "Please Enter File Name";
        }
        else{
            if(someVal == true){
                if(fs.createReadStream(source).pipe(tar.extract(target))){
                    console.log("Created")
                }
                else{
                    console.log("Not Created")
                }
                console.log(await postgresDB());
                ctx.body = init();
                ctx.res.statusCode = 200;

            }
            else{
                ctx.body = "File Not Present";
            }
        }
    }
    else{
        ctx.body = "Wrong Extension."
        ctx.res.statusCode = 422;
    }
});


export default router;
