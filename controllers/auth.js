import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../config/dbpostgres.js';

export class AuthController {
    register = async (req, res) => {
        try {
            const { email, password, role } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            await pool.query(
                'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
                [email, hashedPassword, role ?? 'user']
            );
            res.status(201).json({ message: 'Usuario registrado exitosamente.' });
        } catch (error) {
            res.status(400).json({ message: 'Error al registrar', error: error.message });
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            const user = result.rows[0];
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ message: 'Contraseña incorrecta.' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET ?? 'jwt_secret_key_alternative',
                { expiresIn: '2h' }
            );

            res.status(200).json({ message: 'Autenticación exitosa', token });
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor', error: error.message });
        }
    }
}