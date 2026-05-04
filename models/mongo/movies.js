import { Movie } from "../../shemas/mongo/mivies";

export class MovieModel {
    static async getAll({ genre }) {

        if (genre) {
            return movies.filter(movie =>
                Array.isArray(movie.genre) &&
                movie.genre.some(movieGenre => movieGenre.toLowerCase() === genre.toLowerCase())
            );
        }
        return movies;
    }

    static async getById({ id }) {
        const movie = movies.find(m => m.id === id);
        return movie || null;
    }

    static async create({ input }) {
        const newMovie = {
            id: randomUUID(),
            ...input
        };
        movies.push(newMovie);
        return newMovie;
    }

    static async update({ id, input }) {
        const index = movies.findIndex(m => m.id === id);
        if (index === -1) {
            return null;
        }
        movies[index] = { ...movies[index], ...input };
        return movies[index];
    }

    static async delete({ id }) {
        const index = movies.findIndex(m => m.id === id);
        if (index === -1) {
            return null;
        }
        const [deletedMovie] = movies.splice(index, 1);
        return deletedMovie;
    }
}