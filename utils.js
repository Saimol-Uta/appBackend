import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

// Cambiamos el nombre del parámetro 'path' a 'pathInput' para evitar el conflicto
export const readJson = (pathInput) => {
    // Ahora 'path' se refiere al módulo de Node.js
    const filePath = path.resolve(pathInput);

    try {
        const data = require(filePath);
        return data;
    } catch (error) {
        console.error(`Error reading JSON file at ${filePath}:`, error);
        return null;
    }
};