import { startApp } from '../app.js';
import { MovieModel } from '../models/local/movies.js';

describe('GET /movies/:id no existente (integration)', () => {
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

  it('responde 404 cuando la movie no existe', async () => {
    const nonExistingId = 'does-not-exist';

    const response = await fetch(`${baseUrl}/movies/${nonExistingId}`);

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        error: 'Movie not found'
      })
    );
  });
});
