import { startApp } from '../app.js';
import { MovieModel } from '../models/local/movies.js';

describe('GET /movies (integration)', () => {
  let server;
  let baseUrl;

  beforeAll(async () => {
    const started = startApp({ movieModel: MovieModel, port: 0 });
    server = started.server;

    await new Promise((resolve, reject) => {
      if (server.listening) return resolve();
      server.once('listening', resolve);
      server.once('error', reject);
    });

    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 3001;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(async () => {
    if (!server) return;
    await new Promise((resolve) => server.close(resolve));
  });

  it('responde 200 y retorna un array de movies', async () => {
    const response = await fetch(`${baseUrl}/movies`);

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
