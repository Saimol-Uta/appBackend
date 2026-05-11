import mongoose from 'mongoose';
import 'dotenv/config';
import { createapp } from './app.js';
import { MovieModel } from './models/mongo/movies.js';
import createDb from './config/dbmongo.js';
// const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/movies';

// await mongoose.connect(MONGO_URI);
await createDb();
createapp({ movieModel: MovieModel });