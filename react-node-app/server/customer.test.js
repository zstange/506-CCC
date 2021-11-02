var request = require('supertest');
const { server } = require('./index.js');
const { app } = require('./index.js');


//jest.mock('./index.js');

const mockDb = {
  query: jest.fn().mockResolvedValueOnce("")
};

afterEach(function () {
  server.close();
});

afterAll(() => {
  jest.resetAllMocks();
});

test('get \api', async() => {
      const res = await request(server).get('/api');
      const response = { message: "Hello from server!" }    
      expect(res.status).toBe(200);
      expect(res.body).toEqual(response);
});

test('get \login', async() => {
  const res = await request(server).get('/login');
  const response = { message: "Hello from server!" }    
  expect(res.status).toBe(200);
  expect(res.body).toEqual(response);
});
