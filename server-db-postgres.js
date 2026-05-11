import 'dotenv/config';
import { createapp } from './app.js';
import createDb from './config/dbpostgres.js';
import { MovieModel } from './models/postgres/movies.js';

await createDb();
createapp({ movieModel: MovieModel });