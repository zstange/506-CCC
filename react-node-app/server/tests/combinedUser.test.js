var supertest = require('supertest');
var module = require('../index.js');
const app = module.app;
module.db.end();
module.db = require('../testdb.js');
var tables = require ('../dbTables.js');
var sqlApptTable = tables.sqlApptTable;
var sqlImgTable = tables.sqlImgTable;
var sqlInvTable = tables.sqlInvTable;
var sqlMsgTable = tables.sqlMsgTable;
var sqlPromoTable = tables.sqlPromoTable;
var sqlTestiTable = tables.sqlTestiTable;
var sqlUserTable = tables.sqlUserTable;
var sqlVhlTable = tables.sqlVhlTable;
const tableCreation = [sqlApptTable,sqlImgTable,sqlInvTable,sqlMsgTable,sqlPromoTable,sqlTestiTable,sqlUserTable,sqlVhlTable];
const { server } = require('../server.js');
var request = supertest(app);
jest.setTimeout(30000);

beforeEach(function(){

});

afterEach(function (){
  server.close();
});

afterAll(function () {
  module.db.end();
});

test('get /', async() => {
      const response = await request.get('/');
      const expected = { message: "Hello from server!" }  
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(expected);
});


test('get /login with no info', async () => {
  const response = await request.post('/login');
  const expected = {message: "User doesn't exist!"};
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});


test('get /login with wrong info for password', async () => {
  const expected = {message: "Wrong username/password combination!"}; 
  const response = await request.post('/login').send({ 
  email: 'ejpark@wisc.edu', 
  password: 'wrong'
   });
   expect(response.body).toStrictEqual(expected);
   expect(response.status).toBe(200);
});

test('get /login with correct info', async () => {
  const expected = { userID: 1115, role: 'user' }; 
  const response = await request.post('/login').send({ 
  email: 'fake', 
  password: 'pwd'
   });
   console.log(response.body.userInfo);
   expect(response.body.userInfo).toStrictEqual(expected);
   expect(response.status).toBe(200);
});
