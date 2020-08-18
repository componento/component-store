import * as demo from '../src/repo/component_repo';
import * as tar from '../src/domain/tar_access';


describe('chkExsistComponents:', () => {
    it('returns data.rows', async () => {
        const file_name = '1.tar'
        const actual = await demo.chkExsistComponents(file_name);
        console.log(actual);
        expect(actual.length).toEqual(0);
        expect(actual.length).not.toBe(1);
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
        const actual = await demo.deleteComponents('1.tar');
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
        const actual = await demo.getData('2.tar');
        expect(actual.length >= 0).toBeTruthy();
    });
});

describe('singleComponents:', () => {
    it('returns data.rows', async () => {
        const actual = await demo.getData('2.tar');
        expect(actual.length >= 0).toBeTruthy();
    });
});

describe('updateComponents:', () => {
    it('returns File Not Present ', async () => {
        const actual = await demo.updateComponents('1.tar',1,'/tmp/upload_8b97db885a0db0c90f6276ef269610f1');
        expect(actual).toEqual(0);
        expect(actual).not.toBe(1);
    });
});

describe('extractSpec:', () => {
    it('returns File not found ', async () => {
        const actual = await tar.extractSpec('/tmp/upload_a0e3ca058b7257d148259f5a7dd63faf', '1.tar');
        expect(actual).toBeTruthy();
    });
});

describe('deleteFile:', () => {
    it('returns File not found ', async () => {
        const actual = await tar.deleteFile('1.tar');
        expect(actual).toEqual(0);
        expect(actual).not.toBe(1);
    });
});








// import chaiHttp = require("chai-http");
// import chai = require("chai");
// // import 'mocha';
// import "jasmine";
// import server = require("../src/component-api");
// import { expect } from "chai";
//
//
// chai.should();
//
// chai.use(chaiHttp);
//
// describe('Component API',() =>{
//     /**
//      * List All Components GET Route
//      */
//     describe("GET /list_components", () =>{
//         it('should return all components', (done) => {
//             chai.request(server)
//                 .get("/list_components")
//                 .end((err, response) =>{
//                     response.should.have.status(200);
//                 done();
//                 })
//         });
//     });
//
//
// });

