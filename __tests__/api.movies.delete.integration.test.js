import { startApp } from '../app.js';
import { MovieModel } from '../models/local/movies.js';

describe('DELETE /movies/:id (integration)', () => {
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

  it('responde 200 y retorna mensaje de borrado', async () => {
    const payload = {
      title: 'Delete Integration Movie',
      year: 2024,
      director: 'Integration Director',
      duration: 90,
      rate: 6,
      poster: 'https://example.com/delete-poster.jpg',
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
    expect(created.id).toEqual(expect.any(String));

    const deleteResponse = await fetch(`${baseUrl}/movies/${created.id}`, {
      method: 'DELETE'
    });

    expect(deleteResponse.status).toBe(200);

    const body = await deleteResponse.json();
    expect(body).toEqual(
      expect.objectContaining({
        message: 'Movie deleted successfully'
      })
    );
  });
});
