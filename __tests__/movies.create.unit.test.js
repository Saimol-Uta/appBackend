import { jest } from '@jest/globals';
import { MovieController } from '../controllers/movies.js';

describe('MovieController.create (unit)', () => {
  it('crea una movie y responde 201 con el payload creado', async () => {
    const input = {
      title: 'Test Movie',
      year: 2024,
      director: 'Test Director',
      duration: 120,
      rate: 7,
      poster: 'https://example.com/poster.jpg',
      genre: ['Action']
    };

    const createdMovie = { id: 'test-id', ...input };

    const MovieModel = {
      create: jest.fn().mockResolvedValue(createdMovie)
    };

    const controller = new MovieController({ MovieModel });

    const req = { body: input };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await controller.create(req, res);

    expect(MovieModel.create).toHaveBeenCalledTimes(1);
    expect(MovieModel.create).toHaveBeenCalledWith({ input });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdMovie);
  });
});
