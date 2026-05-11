import { Movie } from "../../shemas/mongo/mivies.js";

export class MovieModel {
    static async getAll({ genre }) {

        if (genre) {
            return Movie.find({
                genre: { $regex: new RegExp(`^${genre}$`, 'i') }
            });
        }
        return Movie.find();
    }

    static async getById({ id }) {
        return Movie.findById(id);
    }

    static async create({ input }) {
        const movie = new Movie(input);
        return movie.save();
    }

    static async update({ id, input }) {
        return Movie.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true
        });
    }

    static async delete({ id }) {
        return Movie.findByIdAndDelete(id);
    }
}