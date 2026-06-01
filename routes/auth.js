import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';
import { verifyToken } from '../middlewares/auth.js';

export const createAuthRouter = () => {
    const authRouter = Router();
    const authController = new AuthController();

    authRouter.post('/register', authController.register);
    authRouter.post('/login', authController.login);


    authRouter.get('/usuarios', verifyToken, (req, res) => {
        res.status(200).json({ message: 'Acceso autorizado. Endpoint de usuarios activo.' });
    });

    return authRouter;
};