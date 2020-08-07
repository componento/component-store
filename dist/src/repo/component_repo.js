"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Data base component
const pool = require('../../database/postgres-db');
const tar_access_1 = require("../domain/tar_access");
function chkExsistComponents(fileName) {
    return pool.connect().then((conn) => {
        return conn.query("SELECT path FROM component WHERE path=$1", [fileName])
            .then((data) => data.rows)
            .finally(() => conn.release());
    });
}
exports.chkExsistComponents = chkExsistComponents;
// Insert query
function insertNewComponents(tarData, updatedFilename) {
    return pool.connect().then((conn) => {
        return conn.query("INSERT INTO component(uuid, name, provider, description, version_name, path)VALUES($1,$2,$3,$4,$5,$6)", [Object.values(tarData)[0], Object.values(tarData)[1], Object.values(tarData)[3], Object.values(tarData)[4], Object.values(tarData)[2], updatedFilename.toString()])
            .then((data) => data.rows)
            .finally(() => conn.release());
    });
}
exports.insertNewComponents = insertNewComponents;
//  update query get component query
function updateComponents(fileName, counter, filePath) {
    return new Promise((resolve, reject) => {
        pool.connect().then((conn) => {
            conn.query("select uuid, name, provider, description, version_name, path, version_id from component where path=$1", [fileName])
                .then(async (data) => {
                let infer1 = JSON.parse(JSON.stringify(data));
                if (infer1.rows.length == 0) {
                    resolve(0);
                }
                else {
                    conn.query("insert into component_version(version_id, old_path, uuid, name, provider, description, version_name) select c.version_id, c.path, c.uuid, c.name, c.provider, c.description, c.version_name from component c where c.version_id=$1", [infer1.rows[0].version_id])
                        .then((data) => {
                    });
                    const verName = infer1.rows[0].version_name.toString() + "_" + fileName;
                    const tarData = await tar_access_1.extractSpec(filePath, verName);
                    conn.query("update component set uuid=$1, name=$2, version_name=$3, provider=$4, description=$5, path=$6 where version_name=$7 and version_id=$8", [Object.values(tarData)[0], Object.values(tarData)[1], Object.values(tarData)[2], Object.values(tarData)[3], Object.values(tarData)[4], verName, infer1.rows[0].version_name, infer1.rows[0].version_id])
                        .then((data) => {
                        let infer3 = JSON.parse(JSON.stringify(data));
                        resolve(verName);
                    });
                }
            })
                .finally(() => conn.release());
        });
    });
}
exports.updateComponents = updateComponents;
// delete component query
function deleteComponents(fileName) {
    return pool.connect().then((conn) => {
        return pool.query("delete from component where path=$1", [fileName])
            .then((data) => data.rows)
            .finally(() => conn.release());
    });
}
exports.deleteComponents = deleteComponents;
// get component query
function getComponents() {
    return pool.connect().then((conn) => {
        return pool.query("select path from component")
            .then((data) => data.rows)
            .finally(() => conn.release());
    });
}
exports.getComponents = getComponents;
// get file data component query
function getData(fileName) {
    return pool.connect().then((conn) => {
        return pool.query("select * from component where path=$1", [fileName])
            .then((data) => data.rows)
            .finally(() => conn.release());
    });
}
exports.getData = getData;
// List version of one Components query
function singleComponents(fileName) {
    return pool.connect().then((conn) => {
        return pool.query("select c.path, c.version_name, cv.old_path , cv.version_name from component c inner join component_version cv on c.version_id=cv.version_id where path=$1", [fileName])
            .then((data) => data.rows)
            .finally(() => conn.release());
    });
}
exports.singleComponents = singleComponents;
//# sourceMappingURL=component_repo.js.map