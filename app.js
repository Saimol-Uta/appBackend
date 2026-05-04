import express from 'express';
// El nombre dentro de las llaves debe coincidir con el export const
import { createMovieRouter } from './routes/movies.js';
import { MovieModel } from './models/local/movies.js';

export const createapp = ({ movieModel }) => {

    const app = express();

    app.use(express.json()); // Middleware correcto

    const PORT = process.env.PORT ?? 3001;

    // Ejecutamos la función pasándole el modelo
    app.use('/movies', createMovieRouter({ MovieModel: movieModel }));

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });

}