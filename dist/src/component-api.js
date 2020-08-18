"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const path_1 = __importDefault(require("path"));
const component_repo_1 = require("./repo/component_repo");
const tar_access_1 = require("./domain/tar_access");
const error_handling_1 = require("./middleware/error_handling");
const koaBody = require("koa-body")({ multipart: true });
const fs = require("fs");
const router = new koa_router_1.default();
let counter = 0;
let list_of_components;
const testFolder = './static/uploads/';
fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
        counter = files.length;
        list_of_components = files;
    });
});
// Upload File to server API
router.post("/upload", koaBody, error_handling_1.findFileMiddleware, async (ctx) => {
    const fileName = ctx.request.body.files.tar.name;
    const filePath = ctx.request.body.files.tar.path;
    let Ext = path_1.default.extname(fileName.toString());
    const users = await component_repo_1.chkExsistComponents(fileName);
    if (Ext == '.tar') {
        if (!fileName) {
            ctx.response.redirect("/");
        }
        else {
            if (Object.values(users).length == 1) {
                ctx.body = 'Component Exsist';
            }
            else {
                const updatedFilename = counter.toString() + ".tar";
                const tarData = await tar_access_1.extractSpec(filePath, updatedFilename);
                await component_repo_1.insertNewComponents(tarData, updatedFilename);
                // console.log('uploading %s -> %s', filfileNametream.path);
                ctx.response.redirect('/components/' + counter);
                ctx.response.header;
                ctx.res.statusCode = 201;
                counter++;
            }
        }
    }
    else {
        ctx.body = "Wrong Extension.";
        ctx.res.statusCode = 422;
    }
});
// Update File to server API
router.put("/update", koaBody, error_handling_1.findFileMiddleware, async (ctx) => {
    const fileName = ctx.request.body.files.tar.name;
    const filePath = ctx.request.body.files.tar.path;
    let Ext = path_1.default.extname(fileName.toString());
    if (Ext == '.tar') {
        if (!fileName) {
            ctx.response.redirect("/");
        }
        else {
            const users = await component_repo_1.updateComponents(fileName, counter, filePath);
            if (users == 0) {
                ctx.body = "Component Not Present ! Please upload component first";
            }
            else {
                ctx.response.redirect('/components/' + users);
                ctx.response.header;
                ctx.res.statusCode = 201;
                counter++;
            }
        }
    }
    else {
        ctx.body = "Wrong Extension.";
        ctx.res.statusCode = 422;
    }
});
// Remmove api
router.delete("/delete", koaBody, error_handling_1.findFileMiddleware, async (ctx) => {
    const fileName = ctx.request.query.file;
    const __dirname = path_1.default.join('static/uploads', fileName);
    const Ext = path_1.default.extname(fileName.toString());
    if (Ext == '.tar') {
        const tarData = await tar_access_1.deleteFile(__dirname);
        console.log('zawar:', tarData);
        if (tarData == 0) {
            ctx.body = "File not found ";
            ctx.res.statusCode = 200;
        }
        else {
            await component_repo_1.deleteComponents(fileName);
            ctx.body = "File removed ";
            ctx.res.statusCode = 200;
        }
    }
    else {
        ctx.body = "Wrong Extension.";
        ctx.res.statusCode = 422;
    }
});
//List All Components
router.get("/list_components", error_handling_1.listFileMiddleware, async (ctx) => {
    const users = await component_repo_1.getComponents();
    ctx.body = users;
    ctx.res.statusCode = 200;
});
// View Details
router.get("/view_details", error_handling_1.findFileMiddleware, async (ctx) => {
    const fileName = ctx.request.query.file;
    const Ext = path_1.default.extname(fileName.toString());
    const users = await component_repo_1.getData(fileName);
    if (Ext == '.tar') {
        if (!fileName) {
            ctx.body = "Please Enter Component Name";
        }
        else {
            if (Object.values(users).length == 0) {
                ctx.body = "Component Not Present";
                ctx.res.statusCode = 200;
            }
            else {
                ctx.body = Object.values(users);
                ctx.res.statusCode = 200;
            }
        }
    }
    else {
        ctx.body = "Wrong Extension.";
        ctx.res.statusCode = 422;
    }
});
//List version of one Components
router.get("/singlecompo_ver", error_handling_1.findFileMiddleware, async (ctx) => {
    const fileName = ctx.request.query.file;
    const Ext = path_1.default.extname(fileName.toString());
    const users = await component_repo_1.singleComponents(fileName);
    if (Ext == '.tar') {
        if (!fileName) {
            ctx.body = "Wrong Extension";
        }
        else {
            if (Object.values(users).length == 0) {
                ctx.body = "File Not Present";
                ctx.res.statusCode = 200;
            }
            else {
                ctx.body = Object.values(users);
            }
        }
    }
    else {
        ctx.body = "Wrong Extension.";
        ctx.res.statusCode = 422;
    }
});
exports.default = router;
//# sourceMappingURL=component-api.js.map