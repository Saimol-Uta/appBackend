import { startApp } from '../app.js';
import { MovieModel } from '../models/local/movies.js';

describe('GET /movies/:id existente (integration)', () => {
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

  it('responde 200 y retorna la movie cuando existe', async () => {
    const payload = {
      title: 'GetById Integration Movie',
      year: 2024,
      director: 'Integration Director',
      duration: 95,
      rate: 7,
      poster: 'https://example.com/getbyid-poster.jpg',
      genre: ['Action']
    };

    const createResponse = await fetch(`${baseUrl}/movies`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();
    expect(created).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...payload
      })
    );

    const getResponse = await fetch(`${baseUrl}/movies/${created.id}`);
    expect(getResponse.status).toBe(200);

    const body = await getResponse.json();
    expect(body).toEqual(
      expect.objectContaining({
        id: created.id,
        ...payload
      })
    );
  });
});
