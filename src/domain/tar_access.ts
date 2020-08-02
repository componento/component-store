import path from "path";

const fs = require("fs");
const tar = require('tar-fs')

export function extract_spec(file_path: string, updated_filename: string) {
    const reader = fs.createReadStream(file_path);

    const stream = fs.createWriteStream(path.join("static/uploads/", updated_filename));
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
