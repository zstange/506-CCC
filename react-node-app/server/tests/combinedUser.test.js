var supertest = require('supertest');
const { app } = require('../index.js');
const { server } = require('../server.js');
const db = require('../db.js');
var request = supertest(server);

afterEach(function (){
  server.close();
});

afterAll(function () {
  db.end();
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
  const expected = { userID: 485, role: "user"}; 
  const response = await request.post('/login').send({ 
  email: 'fake', 
  password: 'pwd'
   });
   expect(response.body).toStrictEqual(expected);
   expect(response.status).toBe(200);
});
