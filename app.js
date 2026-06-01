import express from 'express';
import { createMovieRouter } from './routes/movies.js';
import { createAuthRouter } from './routes/auth.js';
import { corsMiddleware } from './middlewares/cors.js';

export const createapp = ({ movieModel }) => {

    const app = express();

    app.use(express.json());
    app.use(corsMiddleware());
    app.disable('x-powered-by');

    const PORT = process.env.PORT ?? 3001;

    app.use('/movies', createMovieRouter({ MovieModel: movieModel }));
    app.use('/auth', createAuthRouter());

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });

}