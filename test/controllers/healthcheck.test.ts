import { Server } from '../../src/Server';
import supertest from 'supertest';

import packageJson from '../../package.json';
const server = new Server();
const request = supertest(server.router);
console.log(server.router);

describe('GET /healthcheck', () => {
  it('Responds with valid json and the correct parameters', async () => {
    console.log(__dirname);
    const result = await request.get('/healthcheck');
    expect(result.status).toBe(200);

    const keys = Object.keys(result.body);

    expect(keys).toMatchObject(['name', 'version', 'buildNumber', 'commit']);

    expect(result.body.name).toBe(packageJson.name);
    expect(result.body.version).toBe(packageJson.version);
  });
});
