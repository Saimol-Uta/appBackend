import { startApp } from '../app.js';
import { MovieModel } from '../models/local/movies.js';

describe('POST /movies payload invalido (integration)', () => {
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

  it('responde 400 y retorna un array de errores', async () => {
    const invalidPayload = {
      year: 2024,
      director: 'Integration Director',
      duration: 110,
      rate: 8,
      poster: 'https://example.com/integration-poster.jpg',
      genre: ['Action']
    };

    const response = await fetch(`${baseUrl}/movies`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(invalidPayload)
    });

    expect(response.status).toBe(400);

    const body = await response.json();

    expect(body).toEqual(
      expect.objectContaining({
        error: expect.any(Array)
      })
    );
  });
});
