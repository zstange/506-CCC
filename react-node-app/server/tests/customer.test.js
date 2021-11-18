var supertest = require('supertest');
const { app } = require('../index.js');
const { server } = require('../server.js');
const request = supertest(server);
const db = require('../db.js');
const { JsonWebTokenError } = require('jsonwebtoken');
jest.setTimeout(30000);

afterEach(function () {
  server.close();
});

afterAll(function () {
  db.end();
});

test('get /createAccount with no password', async() => {
    const expected = {err: 'cannot hash password'}; 
    const response = await request.post('/createAccount');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

test('get /createAccount with correct info', async () =>{
      const expected =  {message: "Created an account successfully"};
      const response = await request.post('/createAccount').send({
      firstName: 'preetham',
      lastName: 'mukkara',
      email: "fake",
      password: "pwd",
      phoneNumber: "999-999-9999",
      role: "user",
      promotions: "none"
    });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });   

  test('get /addAppointment with incorrect info for query', async() => {
    const expected = {err: "db query error"}; 
    const response = await request.post('/addAppointment').send({
      uid: 3,
      vid: 15,
      dateTime: 3,
      service: "fakeService",
      additionalInfo: "none",
      status: "Not Ready"
    });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('get /addAppointment with correct info', async() => {
    const expected = { message: "Appointment added successfully" }; 
    const response = await request.post('/addAppointment').send({
      uid: 165,
      vid: 15,
      dateTime: 3,
      service: "fakeService",
      additionalInfo: "none",
      status: "Not Ready"
    });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

