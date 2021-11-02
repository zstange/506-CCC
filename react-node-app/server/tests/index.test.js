var request = require('supertest');
const { app } = require('../index.js');
const { server } = require('../server.js');


afterEach(function () {
  server.close();
});

test('get \api', async() => {
      const res = await request(server).get('/api');
      const response = { message: "Hello from server!" }    
      expect(res.status).toBe(200);
      expect(res.body).toEqual(response);
});

test('get \login', async() => {
  const res = await request(server).get('/login');
  const response = "ER_PARSE_ERROR";    
  expect(res.status).toBe(500);
});
