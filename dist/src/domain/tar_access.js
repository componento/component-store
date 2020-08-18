"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Accessing tar file accesor
const path_1 = __importDefault(require("path"));
const fs = require("fs");
const tar = require('tar-fs');
function extractSpec(filePath, updatedFilename) {
    console.log(filePath, updatedFilename);
    const reader = fs.createReadStream(filePath);
    const stream = fs.createWriteStream(path_1.default.join("static/uploads/", updatedFilename));
    reader.pipe(stream);
    return new Promise((resolve, reject) => {
        reader
            .on('data', (chunk) => {
            let a = chunk.toString().match(/{([^}]*)}/);
            let b = JSON.parse(a[0]);
            resolve(b);
            reader.destroy();
        })
            .on("error", reject);
    });
}
exports.extractSpec = extractSpec;
function deleteFile(__dirname) {
    return new Promise((resolve, reject) => {
        fs.unlink(__dirname, function (err) {
            if (err) {
                resolve(0);
            }
            else {
                resolve(1);
            }
        });
    });
}
exports.deleteFile = deleteFile;
//# sourceMappingURL=tar_access.js.map