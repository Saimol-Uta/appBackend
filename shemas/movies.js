import z from 'zod';

export const MovieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Title must be a string',
        required_error: 'Title is required'
    }),
    year: z.number().int().min(1900).max(2050),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().int().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Crime', 'Horror', 'Sci-Fi', 'Fantasy', 'Thriller'], {
            invalid_type_error: 'Movie genre be an array of enum gernes',
            required_error: 'Title is required'
        }
        ))
});

export function validateMovie(input) {
    return MovieSchema.safeParse(input);
}

export function validatePartialMovie(input) {
    return MovieSchema.partial().safeParse(input);
}