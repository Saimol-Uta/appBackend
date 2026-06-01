import express from 'express';
import { createMovieRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

export const createApp = ({ movieModel }) => {
    const app = express();

    app.use(express.json());
    app.use(corsMiddleware());
    app.disable('x-powered-by');

    app.use('/movies', createMovieRouter({ MovieModel: movieModel }));

    return app;
};

export const startApp = ({ movieModel, port = (process.env.PORT ?? 3001) } = {}) => {
    const app = createApp({ movieModel });

    const server = app.listen(port, () => {
        const address = server.address();
        const resolvedPort = typeof address === 'object' && address ? address.port : port;
        console.log(`Servidor escuchando en http://localhost:${resolvedPort}`);
    });

    return { app, server };
};

// Compatibilidad con los scripts actuales (server-db-*.js)
export const createapp = ({ movieModel }) => {
    startApp({ movieModel });
};