import { Router } from 'express';
import { MovieController } from '../controllers/movies.js';

// Usaremos 'createMovieRouter' para evitar confundir la función con la instancia
export const createMovieRouter = ({ MovieModel }) => {
    const moviesRouter = Router();
    const movieController = new MovieController({ MovieModel });

    moviesRouter.get('/', movieController.getAll);
    moviesRouter.get('/:id', movieController.getById);
    moviesRouter.post('/', movieController.create);
    moviesRouter.put('/:id', movieController.update);
    moviesRouter.delete('/:id', movieController.delete);
    moviesRouter.patch('/:id', movieController.update);

    return moviesRouter; // <--- ESTO ES VITAL
}