import { validateMovie, validatePartialMovie } from '../shemas/movies.js'

export class MovieController {
    constructor({ MovieModel }) {
        this.movieModel = MovieModel;
    }

    getAll = async (req, res) => {
        const { genre } = req.query;
        const movies = await this.movieModel.getAll({ genre });
        res.json(movies);
    }

    getById = async (req, res) => {
        const { id } = req.params;
        const movie = await this.movieModel.getById({ id });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    }

    create = async (req, res) => {
        const validation = validateMovie(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: validation.error.issues
            });
        }
        const newMovie = await this.movieModel.create({ input: validation.data });
        res.status(201).json(newMovie);
    }

    update = async (req, res) => {
        const { id } = req.params;
        const validation = validatePartialMovie(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues });
        }
        const updatedMovie = await this.movieModel.update({
            id, input: validation.data
        });
        res.json(updatedMovie);
    }

    delete = async (req, res) => {
        const { id } = req.params;
        const deletedMovie = await this.movieModel.delete({ id });
        if (!deletedMovie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted successfully' });
    }
}