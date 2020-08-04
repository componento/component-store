import Router from "koa-router";
import path from "path";
import { chkExsistComponents, insertNewComponents, updateComponents, deleteComponents, getComponents, getData, singleComponents } from './repo/component_repo';
import { extractSpec, deleteFile } from './domain/tar_access';
const koaBody = require("koa-body")({multipart:true});
const fs = require("fs");
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
router.post("/upload",koaBody ,async (ctx, next) => {
    const fileName = ctx.request.body.files.tar.name;
    const filePath = ctx.request.body.files.tar.path;
    let Ext = path.extname(fileName.toString());
    const users = await chkExsistComponents(fileName);

    if(Ext == '.tar') {
        if (!fileName) {
            ctx.response.redirect("/");
        } else {
            if (Object.values(users).length == 1) {
                ctx.body = 'Component Exsist';
            } else {
                const updatedFilename = counter.toString() + ".tar";
                const tarData = await extractSpec(filePath, updatedFilename);
                await insertNewComponents(tarData,updatedFilename);
                // console.log('uploading %s -> %s', filfileNametream.path);
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
    const fileName = ctx.request.body.files.tar.name;
    const filePath = ctx.request.body.files.tar.path;
    let Ext = path.extname(fileName.toString());

    if(Ext == '.tar') {
        if (!fileName) {
            ctx.response.redirect("/");
        } else {
            const users = await updateComponents(fileName,counter,filePath);
            console.log(users);
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

// Remmove api
router.delete("/delete", koaBody,async ctx => {
    const fileName = ctx.request.query.file;
    const __dirname = path.join('static/uploads',fileName);
    const Ext = path.extname(fileName.toString());

    if(Ext == '.tar') {
        const tarData = await deleteFile(__dirname);
        if (tarData==0)
        {
            ctx.body = "File not found ";
            ctx.res.statusCode = 200;

        }
        else{
            await deleteComponents(fileName);
            ctx.body = "File removed ";
            ctx.res.statusCode = 200;
        }
    }
    else{
        ctx.body = "Wrong Extension."
        ctx.res.statusCode = 422;
    }

});

//List All Components
router.get("/list_components", async (ctx, next) => {
    const users = await getComponents();
    ctx.body = users;
    ctx.res.statusCode = 200;
});


// View Details
router.get("/view_details", async (ctx, next) => {
    const fileName = ctx.request.query.file;
    const Ext = path.extname(fileName.toString());
    const users = await getData(fileName);
    console.log(users);

    if(Ext == '.tar'){
        if (!fileName) {
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

//List version of one Components
router.get("/singlecompo_ver", async (ctx, next) => {
    const fileName = ctx.request.query.file;
    const Ext = path.extname(fileName.toString());
    const users = await singleComponents(fileName);

    if(Ext == '.tar'){
        if (!fileName) {
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
