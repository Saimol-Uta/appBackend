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

  it('responde 400 cuando el payload es invalido y no llama al modelo', async () => {
    const invalidInput = {
      year: 2024,
      director: 'Test Director',
      duration: 120,
      rate: 7,
      poster: 'https://example.com/poster.jpg',
      genre: ['Action']
    };

    const MovieModel = {
      create: jest.fn()
    };

    const controller = new MovieController({ MovieModel });

    const req = { body: invalidInput };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await controller.create(req, res);

    expect(MovieModel.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Array)
      })
    );
  });

  it('propaga el error cuando el modelo falla y no responde 201', async () => {
    const input = {
      title: 'Test Movie',
      year: 2024,
      director: 'Test Director',
      duration: 120,
      rate: 7,
      poster: 'https://example.com/poster.jpg',
      genre: ['Action']
    };

    const MovieModel = {
      create: jest.fn().mockRejectedValue(new Error('DB error'))
    };

    const controller = new MovieController({ MovieModel });

    const req = { body: input };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await expect(controller.create(req, res)).rejects.toThrow('DB error');

    expect(res.status).not.toHaveBeenCalledWith(201);
  });
});
