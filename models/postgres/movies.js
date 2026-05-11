import { randomUUID } from 'node:crypto';
import { pool } from '../../config/dbpostgres.js';

const movieColumns = 'id, title, year, director, duration, rate, poster, genre';

export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            const { rows } = await pool.query(
                `
                    SELECT ${movieColumns}
                    FROM movies
                    WHERE EXISTS (
                        SELECT 1
                        FROM unnest(genre) AS movie_genre
                        WHERE lower(movie_genre) = lower($1)
                    )
                    ORDER BY title ASC
                `,
                [genre]
            );

            return rows;
        }

        const { rows } = await pool.query(
            `
                SELECT ${movieColumns}
                FROM movies
                ORDER BY title ASC
            `
        );

        return rows;
    }

    static async getById({ id }) {
        const { rows } = await pool.query(
            `
                SELECT ${movieColumns}
                FROM movies
                WHERE id = $1
            `,
            [id]
        );

        return rows[0] ?? null;
    }

    static async create({ input }) {
        const movieId = randomUUID();

        const { rows } = await pool.query(
            `
                INSERT INTO movies (id, title, year, director, duration, rate, poster, genre)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING ${movieColumns}
            `,
            [
                movieId,
                input.title,
                input.year,
                input.director,
                input.duration,
                input.rate ?? 5,
                input.poster,
                input.genre
            ]
        );

        return rows[0];
    }

    static async update({ id, input }) {
        const entries = Object.entries(input);

        if (entries.length === 0) {
            return this.getById({ id });
        }

        const values = [id];
        const setClauses = entries.map(([field, value], index) => {
            values.push(value);
            return `${field} = $${index + 2}`;
        });

        const { rows } = await pool.query(
            `
                UPDATE movies
                SET ${setClauses.join(', ')}
                WHERE id = $1
                RETURNING ${movieColumns}
            `,
            values
        );

        return rows[0] ?? null;
    }

    static async delete({ id }) {
        const { rows } = await pool.query(
            `
                DELETE FROM movies
                WHERE id = $1
                RETURNING ${movieColumns}
            `,
            [id]
        );

        return rows[0] ?? null;
    }
}