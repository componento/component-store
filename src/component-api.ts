import Router from "koa-router";
import path from "path";
import {Json} from "sequelize/types/lib/utils";
import * as util from "util";
import {callbackify} from "util";
const pool = require('../database/postgres-db');
import { chk_exsist_components, insert_new_components, updatecomponents } from './repo/component_repo';
import { extract_spec } from './domain/tar_access';

const koaBody = require("koa-body")({multipart:true});
const koaStatic = require('koa-static')
const fs = require("fs");
var tar = require('tar-fs')
const os = require('os');

const router = new Router();

let counter = 0;
var list_of_components: any[];
const testFolder = './static/uploads/';


fs.readdir(testFolder, (err: any, files: any[]) => {
    files.forEach(file => {
        counter = files.length;
        list_of_components = files;
    });
});

const __Uploaddirname = 'static/uploads';
const __Extractdirname = 'static/ext';
var ext_name = require('path');


// Upload File to server API
router.post("/upload",koaBody ,async (ctx, next) => {
    const file_name = ctx.request.body.files.foo.name;
    const file_path = ctx.request.body.files.foo.path;
    var ext_name = require('path');
    var ext = path.extname(file_name.toString());
    const users = await chk_exsist_components(file_name);

    if(ext == '.tar') {
        if (!file_name) {
            ctx.response.redirect("/");
        } else {
            if (Object.values(users).length == 1) {
                ctx.body = 'Component Exsist';
            } else {
                const updated_filename = counter.toString() + ".tar";
                const tar_data = await extract_spec(file_path, updated_filename);
                await insert_new_components(tar_data,updated_filename);
                // console.log('uploading %s -> %s', file_name, stream.path);
                ctx.response.redirect('/components/' + counter);
                ctx.response.header;
                ctx.res.statusCode = 201;
                counter++;
             }
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
            const users = await updatecomponents(file_name,counter,file_path);
            console.log('out: ',users);
            if (users==0){
                ctx.body = "Component Not Present ! Please upload component first";
            }
            else{
                ctx.response.redirect('/components/'+ users);
                ctx.response.header;
                ctx.res.statusCode = 201;
                counter++;
            }
        }
    }
    else{
        ctx.body = "Wrong Extension."
        ctx.res.statusCode = 422;
    }
});

// delete component query
function deletecomponents(file_name: any) {
    return new Promise((resolve, reject)=> {
        pool.connect();
        pool.query("delete from component where path='" + file_name + "'",
            function(err: any, data: unknown) {
                if(err) {
                    return reject(err);
                }
                var infer = JSON.parse(JSON.stringify(data));
                resolve(infer.rows);
            });
    })
}
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
            else {
                console.log('File deleted!');
                ctx.body = "Component have been removed";
                ctx.res.statusCode = 200;

            }
        });
        await deletecomponents(file_name);
    }
    else{
        ctx.body = "Wrong Extension."
        ctx.res.statusCode = 422;
    }

});

// get component query
function getcomponents() {
    return new Promise((resolve, reject)=> {
        pool.connect();
        pool.query("select path from component",
            function(err: any, data: unknown) {
                if(err) {
                    return reject(err);
                }
                var infer = JSON.parse(JSON.stringify(data));
                resolve(infer.rows);
            });
    })
}

//List All Components
router.get("/list_components", async (ctx, next) => {
    const users = await getcomponents();
    ctx.body = users;
    ctx.res.statusCode = 200;
});

// get file data component query
function getdata(file_name: string) {
    return new Promise((resolve, reject)=> {
        pool.connect();
        pool.query("select * from component where path='" + file_name + "'",
            function(err: any, data: unknown) {
                if(err) {
                    return reject(err);
                }
                var infer = JSON.parse(JSON.stringify(data));
                resolve(infer.rows);
            });
    })
}

// View Details
router.get("/view_details", async (ctx, next) => {
    var file_name = ctx.request.query.file;
    var ext = path.extname(file_name.toString());
    var someVal = list_of_components.includes(file_name);
    const users = await getdata(file_name);
    console.log(users);

    if(ext == '.tar'){
        if (!file_name) {
            ctx.body = "Please Enter Component Name";
        }
        else{
            if(Object.values(users).length == 0){
                ctx.body = "Component Not Present";
                ctx.res.statusCode = 200;
            }
            else{
                ctx.body = Object.values(users);
                ctx.res.statusCode = 200;
            }
        }
    }
    else{
        ctx.body = "Wrong Extension."
        ctx.res.statusCode = 422;
    }
});

// List version of one Components query
function singlecomponents(file_name: any) {
    return new Promise((resolve, reject)=> {
        pool.connect();
        pool.query("select c.path, cv.version_name from component c inner join component_version cv on c.version_id=cv.version_id where path='" + file_name + "'",
            function(err: any, data: unknown) {
                if(err) {
                    return reject(err);
                }
                var infer = JSON.parse(JSON.stringify(data));

                resolve(infer.rows);
            });
    })
}

//List version of one Components
router.get("/singlecompo_ver", async (ctx, next) => {
    var file_name = ctx.request.query.file;
    var ext = path.extname(file_name.toString());
    var users = await singlecomponents(file_name);

    if(ext == '.tar'){
        if (!file_name) {
            ctx.body = "Wrong Extension";
        }
        else{
            if(Object.values(users).length == 0){
                ctx.body = "File Not Present";
                ctx.res.statusCode = 200;
            }
            else{
                ctx.body = Object.values(users);
            }
        }
    }
    else{
        ctx.body = "Wrong Extension."
        ctx.res.statusCode = 422;
    }
});

export default router;
