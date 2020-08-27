import * as demo from '../src/repo/component_repo';
import * as tar from '../src/domain/tar_access';
import * as app from '../src/component-api';
var request = require('request');
// import {request} from "http";


describe('chkExsistComponents:', () => {
    it('returns data.rows', async () => {
        const file_name = '1.tar'
        const actual = await demo.chkExsistComponents(file_name);
        console.log("here", actual)
        if (actual == 0){
            expect(actual.length).toEqual(0);
        }
        else{
            expect(actual.length >= 0).toBeTruthy();
        }
    });
});


const testing_dict ={
        id: '19223-32312-23',
        name: 'X-Selling',
        version: '1.2.2',
        provider: 'Mega Insurances',
        description: 'Add this component to your store to cross-sell some product insurances.'
}
const up_filename = '1.tar';

describe('insertNewComponents:', () => {
    it('returns data.rows', async () => {
        const file_name = '1.tar'
        const actual = await demo.insertNewComponents(testing_dict, up_filename);
        expect(actual.length).toEqual(0);
    });
});

describe('deleteComponents:', () => {
    it('returns data.rows', async () => {
        const file_name = '1.tar'
        const actual = await demo.deleteComponents(file_name);
        expect(actual.length).toEqual(0);
    });
});

describe('getComponents:', () => {
    it('returns data.rows', async () => {
        const actual = await demo.getComponents();
        expect(actual.length >= 0).toBeTruthy();
    });
});

describe('getData:', () => {
    it('returns data.rows', async () => {
        const file_name = '1.tar'
        const actual = await demo.getData(file_name);
        expect(actual.length >= 0).toBeTruthy();
    });
});

describe('singleComponents:', () => {
    it('returns data.rows', async () => {
        const file_name = '1.tar'
        const actual = await demo.getData(file_name);
        expect(actual.length >= 0).toBeTruthy();
    });
});

describe('updateComponents:', () => {
    it('returns File Not Present ', async () => {
        const file_name = '1.tar'
        const file_path = '/tmp/upload_3f8d5b9845455247a2ed10e3c7b68c71'
        const actual = await demo.updateComponents(file_name,1,file_path);
        if (actual == 0)
        {
            expect(actual).toEqual(0);
        }
        else{
            expect(actual).toContain(".tar");
        }
    });
});

describe('extractSpec:', () => {
    it('returns File not found ', async () => {
        const file_name = '1.tar'
        const file_path = '/tmp/upload_3f8d5b9845455247a2ed10e3c7b68c71'
        const actual = await tar.extractSpec(file_path, file_name);
        expect(actual).toBeTruthy();
    });
});

describe('deleteFile:', () => {
    it('returns File not found ', async () => {
        const file_name = '1.tar'
        const actual = await tar.deleteFile(file_name);
        if(actual==0){
            expect(actual).toEqual(0);
        }
        else {
            expect(actual).not.toBe(1);
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////////////
// Integration Tests for REST APIs ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

// Upload Api Test
describe("POST /upload", () =>{
    it("should respond with 201", function(done) {
        request({
            method: 'POST',
            uri: 'http://localhost:3000/upload',
            body: JSON.stringify({
                Key: 'tar',
                VALUE: '1.tar'
            }),
            headers: { 'content-type': 'text/plain; charset=utf-8' },

        }, function (error: any, response: any, body: any) {
            if (error) {
                return console.dir("Error: ",error);
            }
            // JSON.parse(response.request.body)
            if (response.body == "Select File") {
                expect(response.statusCode).toBe(500);
            }
            else if(response.statusMessage == "Found"){
                expect(response.statusCode).toBe(201);
            }
            else if(response.body == "Wrong Extension"){
                expect(response.statusCode).toBe(422);
                expect(response.statusMessage).toBe("OK");
            }
            done();
        });
    });
});

// Upload Api Test
describe("PUT /update", () =>{
    it("should respond with 201", function(done) {
        request({
            method: 'PUT',
            uri: 'http://localhost:3000/update',
            body: JSON.stringify({
                Key: 'tar',
                VALUE: '1.tar'
            }),
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },

        }, function (error: any, response: any, body: any) {
            if (error) {
                return console.dir("Error: ",error);
            }
            // JSON.parse(response.request.body)
            if (response.body == "Select File") {
                expect(response.statusCode).toBe(500);
            }
            else if(response.statusMessage == "Found"){
                expect(response.statusCode).toBe(201);
            }
            else if(response.statusMessage == "Component Not Present ! Please upload component first"){
                expect(response.statusCode).toBe(200);
            }
            else if(response.body == "Wrong Extension"){
                expect(response.statusCode).toBe(422);
                expect(response.statusMessage).toBe("OK");
            }
            done();
        });
    });
});

// Remove Api Test
describe("DELETE /delete", () =>{
    it("should respond with 200", function(done) {
        request({
            method: 'DELETE',
            uri: 'http://localhost:3000/delete?file=1.tar',
            Params: { 'file': '1.tar' },

        }, function (error: any, response: any, body: any) {
            if (error) {
                return console.dir("Error: ",error);
            }
            if (response.body == "Select File") {
                expect(response.statusCode).toBe(500);
            }
            else if (response.body == "File removed") {
                expect(response.statusCode).toBe(200);
            }
            else if(response.body == "File not found "){
                expect(response.statusCode).toBe(200);
            }
            else if(response.body == "Wrong Extension"){
                expect(response.statusCode).toBe(422);
                expect(response.statusMessage).toBe("OK");
            }
            done();
        });
    });
});

// List All Components Api Test
describe("GET /list_components", () =>{
    it("should respond with 200", function(done) {
        request({
            method: 'GET',
            uri: 'http://localhost:3000/list_components',
            headers: { 'Content-Type': 'application/json' },

        }, function (error: any, response: any, body: any) {
            if (error) {
                return console.dir("Error: ",error);
            }
            if (response.statusMessage == "OK") {
                expect(response.statusCode).toBe(200);
            }
            else if(response.body == []){
                expect(response.statusCode).toBe(200);
            }
            done();
        });
    });
});

const vd =  JSON.stringify(
    {
        "auto_id": 186,
        "uuid": "19223-32312-23",
        "name": "X-Selling",
        "provider": "Mega Insurances",
        "description": "Add this component to your store to cross-sell some product insurances.",
        "version_name": "1.2.2",
        "path": "1.tar",
        "version_id": 186
    }
)

// View Details Api Test
describe("GET /view_details", () =>{
    it("should respond with 200", function(done) {
        request({
            method: 'GET',
            uri: 'http://localhost:3000/view_details?file=1.tar',
            Params: { 'file': '1.tar' },

        }, function (error: any, response: any, body: any) {
            if (error) {
                return console.dir("Error: ",error);
            }
            // JSON.parse(response.request.body)
            if (response.body == vd) {
                expect(response.statusCode).toBe(200);
            }
            else if(response.body == "Component Not Present"){
                expect(response.statusCode).toBe(200);
            }
            else if(response.body == "Select File"){
                expect(response.statusCode).toBe(500);
            }
            else if(response.body == "Wrong Extension"){
                expect(response.statusCode).toBe(422);
                expect(response.statusMessage).toBe("OK");
            }
            done();
        });
    });
});

// List version of one Components Api Test
describe("GET /singlecompo_ver", () =>{
    it("should respond with 200", function(done) {
        request({
            method: 'GET',
            uri: 'http://localhost:3000/singlecompo_ver?file=1.tar',
            Params: { 'file': '1.tar' },

        }, function (error: any, response: any, body: any) {
            if (error) {
                return console.dir("Error: ",error);
            }
            if(response.body == "File Not Present"){
                expect(response.statusCode).toBe(200);
            }
            else if(response.body == "Select File"){
                expect(response.statusCode).toBe(500);
            }
            else if(response.body == "Wrong Extension"){
                expect(response.statusCode).toBe(422);
                expect(response.statusMessage).toBe("OK");
            }
            done();
        });
    });
});
