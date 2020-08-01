const pool = require('../../database/postgres-db');
import { extract_spec } from '../domain/tar_access';

export function chk_exsist_components(file_name: any) {
    return new Promise((resolve, reject)=> {
        pool.connect().then((conn: any) => {
            conn.query("SELECT path FROM component WHERE path=$1", [file_name])
                .then((data: any) => {
                    let infer = JSON.parse(JSON.stringify(data));
                    resolve(infer.rows);
                })
                .finally(() => conn.release());
        })
    })
}

// Insert query
export function insert_new_components(tar_data: any,updated_filename: string) {
    return new Promise((resolve, reject)=> {
        pool.connect().then((conn: any) => {
            conn.query("INSERT INTO component(uuid, name, provider, description, version_name, path)VALUES($1,$2,$3,$4,$5,$6)", [Object.values(tar_data)[0], Object.values(tar_data)[1], Object.values(tar_data)[3], Object.values(tar_data)[4], Object.values(tar_data)[2] , updated_filename.toString()])
                .then((data: any) => {
                    let infer = JSON.parse(JSON.stringify(data));
                    resolve(infer.rows);
                })
                .finally(() => conn.release());
            // conn.query("INSERT INTO component_version(uuid, name, provider, description, version_name, path)VALUES($1,$2,$3,$4,$5,$6)", [Object.values(tar_data)[0], Object.values(tar_data)[1], Object.values(tar_data)[3], Object.values(tar_data)[4], Object.values(tar_data)[2] , updated_filename.toString()])
            //     .then((data: any) => {
            //         let infer = JSON.parse(JSON.stringify(data));
            //         resolve(infer.rows);
            //     })
            //     .finally(() => conn.release());
        })
    })
}

//  update query get component query
export function updatecomponents(file_name: any,counter: number,file_path: string) {
    return new Promise((resolve, reject) => {
        console.log('Params:', file_name, counter);
        pool.connect().then((conn: any) => {
            conn.query("select uuid, name, provider, description, version_name, path, version_id from component where path=$1", [file_name])
                .then(async (data: unknown) => {
                    var infer1 = JSON.parse(JSON.stringify(data));
                    if (infer1.rows.length == 0) {
                        resolve(0);
                    } else {
                        conn.query("insert into component_version(version_id, old_path, uuid, name, provider, description, version_name) select c.version_id, c.path, c.uuid, c.name, c.provider, c.description, c.version_name from component c where c.version_id=$1",[infer1.rows[0].version_id])
                            .then((data: unknown) => {

                            })
                        const ver_name = file_name + "_" + counter.toString() + ".tar";
                        const tar_data = await extract_spec(file_path, ver_name);
                        conn.query("update component set uuid=$1, name=$2, version_name=$3, provider=$4, description=$5, path=$6 where version_name=$7 and version_id=$8",
                            [Object.values(tar_data)[0],Object.values(tar_data)[1], Object.values(tar_data)[2], Object.values(tar_data)[3], Object.values(tar_data)[4], ver_name, infer1.rows[0].version_name, infer1.rows[0].version_id])
                            .then(( data: unknown) => {
                                var infer3 = JSON.parse(JSON.stringify(data));
                                console.log('In3: ', infer3);
                                resolve(ver_name);
                            })
                    }
                })
                .finally(() => conn.release());
        })
    })
}
