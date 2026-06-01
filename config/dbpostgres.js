import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'postgres',
    database: process.env.POSTGRES_DB ?? 'movies'
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createMoviesTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS movies (
            id UUID PRIMARY KEY,
            title TEXT NOT NULL,
            year INTEGER NOT NULL,
            director TEXT NOT NULL,
            duration INTEGER NOT NULL,
            rate INTEGER NOT NULL DEFAULT 5,
            poster TEXT NOT NULL,
            genre TEXT[] NOT NULL
        )
    `);
};

// Dentro de config/dbpostgres.js, añade esta función arriba:
const createUsersTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user'
        )
    `);
};



const createDb = async () => {
    const retries = Number(process.env.POSTGRES_CONNECT_RETRIES ?? 10);
    const delayMs = Number(process.env.POSTGRES_CONNECT_DELAY_MS ?? 1000);
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt += 1) {
        try {
            const client = await pool.connect();

            try {
                await createMoviesTable();
                await createUsersTable();
                console.log('PostgreSQL connected');
                return pool;
            } finally {
                client.release();
            }
        } catch (error) {
            lastError = error;

            if (attempt < retries) {
                console.warn(`PostgreSQL not ready yet (${attempt}/${retries}), retrying...`);
                await sleep(delayMs);
            }
        }
    }

    console.error(`Error connecting to PostgreSQL: ${lastError?.message ?? 'Unknown error'}`);
    await pool.end().catch(() => { });
    process.exit(1);
};





export { pool };
export default createDb;