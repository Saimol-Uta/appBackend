import { createapp } from "./app";
import { MovieModel } from './models/local/movies.js';

createapp({ movieModel: MovieModel });