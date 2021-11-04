var request = require('supertest');
const { app } = require('../index.js');
const { server } = require('../server.js');
const db = require('../db.js');


afterEach(function () {
  server.close();
});

afterAll(function () {
  db.end();
});

test('get /', async() => {
      const res = await request(server).get('/');
      const response = { message: "Hello from server!" }    
      expect(res.status).toBe(200);
      expect(res.body).toEqual(response);
});

test('get /login', async() => {
  const res = await request(server).get('/login');
  const response = {message: "User doesn't exist!"};    
  expect(res.status).toBe(200);
  expect(res.body).toEqual(response);
});
