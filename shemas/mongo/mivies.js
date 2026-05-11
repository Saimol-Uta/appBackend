import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Title is required'], trim: true },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1900, 'Year must be a valid year'],
        max: [2050, 'Year must be a valid year']
    },
    director: {
        type: String,
        required: [true, 'Director is required'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be a positive number']
    },
    poster: {
        type: String,
        required: [true, 'Poster is required'],
        match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, 'Poster must be a valid URL']
    },
    genre: [{
        type: String,
        required: [true, 'Genre is required'],
        enum: {
            values: ['Action', 'Adventure', 'Comedy', 'Drama', 'Crime', 'Horror', 'Sci-Fi', 'Fantasy', 'Thriller'],
            message: 'Genre must be one of the following: Action, Adventure, Comedy, Drama, Crime, Horror, Sci-Fi, Fantasy, Thriller'
        }
    }],
}, {
    timestamps: true
});

export const Movie = mongoose.model('Movie', movieSchema);