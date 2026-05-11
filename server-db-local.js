import { createapp } from "./app.js";
import { MovieModel } from './models/local/movies.js';

createapp({ movieModel: MovieModel });