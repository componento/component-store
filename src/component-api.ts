import Router from "koa-router";
import path from "path";
import {Json} from "sequelize/types/lib/utils";
import * as util from "util";
import {callbackify} from "util";
const pool = require('../database/postgres-db');

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


async function packTar(source: string, target: string) {
    try {
        const readStream = fs.createReadStream(source.toString());
        const writeStream = tar.extract(target.toString());

        console.log('here0',list_of_components,source,target);

        readStream.pipe(writeStream);

        console.log('Directory Created!');
        writeStream.on('end', () => {
            console.log('Done');
        });
        return 1;
    }
    catch (err) {
        console.error(err)
    }
}


const __Uploaddirname = 'static/uploads';
const __Extractdirname = 'static/ext';
var ext_name = require('path');

async function extract_dir(updated_filename: { toString: () => string; }){
    var ext = path.extname(updated_filename.toString());
    const __extpath = path.join(__Extractdirname,updated_filename.toString(),'sample_component');
    const source = path.join(__Uploaddirname,updated_filename.toString());
    const target = path.join(__Extractdirname,updated_filename.toString());
    var someVal = list_of_components.includes(updated_filename.toString());
    console.log('here:',source,target,__extpath,updated_filename.toString(),someVal)

    // function init() {
    //     return JSON.parse(fs.readFileSync(path.join(__extpath,fs.readdirSync(__extpath).filter((name:string) => path.extname(name) === '.json')[0])));
    // }
    if(someVal == true) {
        console.log('I am here');
        var result = packTar(source, target);
        console.log(result);
    }
    else{
        console.log("File Not Present");
    }
}

// Upload File to server API
router.post("/upload",koaBody ,async (ctx, next) => {
    const file_name = ctx.request.body.files.foo.name;
    const file_path = ctx.request.body.files.foo.path;
    var ext_name = require('path');
    var ext = path.extname(file_name.toString());


    if(ext == '.tar') {
        if (!file_name) {
            ctx.response.redirect("/");
        } else {
            const reader = fs.createReadStream(file_path);

            const updated_filename = counter.toString() + ".tar";

            const stream = fs.createWriteStream(path.join("static/uploads/", updated_filename));
            // const target = path.join(__Extractdirname,updated_filename.toString());
            // const writeStream = tar.extract(target.toString());
            reader.pipe(stream);
            // reader.pipe(writeStream);

            reader.on('data', (chunk: any) => {
                var a = chunk.toString().match(/{([^}]*)}/);
                var b = JSON.parse(a[0]);
                pool.connect();
                var QS1 = util.format("INSERT INTO component(uuid, name, provider, description, path, version_id)VALUES('%s','%s','%s','%s','%s','2')", b.id, b.name, b.provider, b.description, updated_filename.toString());
                pool.query(QS1,
                    (err: any, res: any) => {
                        console.log('here1',err, res);
                    }
                );
                var QS2 = util.format("INSERT INTO component_version(version_id, version_name, version_path)VALUES('2','%s','%s')", b.version, updated_filename);
                pool.query(QS2,
                    (err: any, res: any) => {
                        console.log('here2',err, res);
                        // pool.end();
                    }
                );
            });

            console.log('uploading %s -> %s', file_name, stream.path);
            list_of_components.push(updated_filename);
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
// update query
// get component query
function updatecomponents(file_name: any) {
    return new Promise((resolve, reject)=> {
        pool.connect();
        pool.query("select c.uuid, c.name, c.provider, c.description, c.path, c.version_id, cv.version_name from component c inner join component_version cv on c.version_id=cv.version_id where path='" + file_name + "'",
            function(err: any, data: unknown) {
                if(err) {
                    return reject(err);
                }
                var infer = JSON.parse(JSON.stringify(data));
                if (infer.rows.length == 0){
                    resolve("File not Present");
                }
                else{
                    var up = infer.rows[0];
                    pool.query("update component set uuid='" + up.uuid + "', name='" + up.name + "', provider='" + up.provider + "', description='" + up.description + "', path='" + file_name + "', version_id='" + up.version_id + "' where path='" + file_name + "'",
                        function(err: any, data: unknown) {
                            if(err) {
                                return reject(err);
                            }
                            resolve("Component updated");
                        });

                    pool.query("update component_version set version_id='" + up.version_id + "', version_name='" + up.version_name + "', version_path='" + file_name + "' where path='" + file_name + "'",
                        function(err: any, data: unknown) {
                            if(err) {
                                return reject(err);
                            }
                            resolve("Component version updated");
                        });
                }
            });
    })
}
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
            const users = await updatecomponents(file_name);
            console.log(users);
            const reader = fs.createReadStream(file_path);
            const stream = fs.createWriteStream(path.join("static/uploads/", counter.toString())+".tar");
            reader.pipe(stream);
            // console.log('uploading %s -> %s', file_name, stream.path);
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
                ctx.body = "File have been removed";
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
        // {'Components_List' : list_of_components};
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
                resolve(infer.rows[0]);
            });
    })
}

// View Details
router.get("/view_details", async (ctx, next) => {
    var file_name = ctx.request.query.file;
    var ext = path.extname(file_name.toString());
    // const __extpath = path.join(__Extractdirname,file_name.toString(),'sample_component');
    // var source = path.join(__Uploaddirname,file_name);
    // var target = path.join(__Extractdirname,file_name);
    var someVal = list_of_components.includes(file_name);

    if(ext == '.tar'){
        if (!file_name) {
            ctx.body = "Please Enter File Name";
        }
        else{
            if(someVal == true){
                // ctx.body = await packTar(source,target);
                // var ret = await packTar(source, target);
                const users = await getdata(file_name);
                ctx.body = users;
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
