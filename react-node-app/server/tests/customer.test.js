var supertest = require('supertest');
const { app } = require('../index.js');
const { server } = require('../server.js');
const request = supertest(server);
const db = require('../db.js');


afterEach(function () {
  server.close();
});

afterAll(function () {
  db.end();
});

test('get /createAccount with no info', async() => {
    const expected = {err: 'cannot hash password'}; 
    const response = await request.post('/createAccount');
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

test('get /createAccount with correct info', async () =>{
      const expected =  {redirect: "/login" };
      const response = await request.post('/createAccount').send({
      firstName: 'preetham',
      lastName: 'mukkara',
      email: "fake",
      password: "pwd",
      phoneNumber: "999-999-9999",
      role: "user",
      promotions: "none"
    });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });   
