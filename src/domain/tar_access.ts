// Accessing tar file accesor
import path from "path";

const fs = require("fs");
const tar = require('tar-fs')

export function extractSpec(filePath: string, updatedFilename: string) {
    const reader = fs.createReadStream(filePath);
    const stream = fs.createWriteStream(path.join("static/uploads/", updatedFilename));
    reader.pipe(stream);
    return new Promise((resolve, reject)=> {
        reader
            .on('data', (chunk: any) => {
                let a = chunk.toString().match(/{([^}]*)}/);
                let b = JSON.parse(a[0])
                resolve(b);
                reader.destroy();
            })
            .on("error", reject);
    });
}

export function deleteFile(__dirname: string){
    return new Promise((resolve, reject)=> {
        fs.unlink(__dirname, function (err: any) {
            if (err) {
                resolve(0);
            }
            else {
                resolve(1);

            }
        });
    });
}
