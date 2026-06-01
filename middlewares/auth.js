import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

    if (!token) {
        return res.status(403).json({ message: 'No se proporcionó un token de acceso.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? 'jwt_secret_key_alternative');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};