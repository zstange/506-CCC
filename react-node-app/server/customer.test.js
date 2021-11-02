import { Express } from 'jest-express/lib/express';
import { server } from './index.js';

let app;

describe('Server', () => {
  beforeEach(() => {
    app = new Express();
  });

  afterEach(() => {
    app.resetMocked();
  });

  test('should setup server', () => {
    const options = {
      port: 3001,
    };

    server(app, options);

    expect(app.set).toBeCalledWith('port', options.port);
  });
});