import User from "../model/User.js";
import { JWT_SECRET } from "../config/config.js";
import jwt from 'jsonwebtoken'
export const validarJWT = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization) return res.status(400).json({ error: 'unauthorized' })
        const decoded = jwt.verify(authorization, JWT_SECRET)
        const usuario = await User.getId(decoded.userId)
        req.usuario = usuario
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) return res.status(400).json({ message: 'Token expirado' })
        if (error instanceof jwt.JsonWebTokenError) return res.status(400).json({ message: 'Token invalido' })
        res.status(500).json({ message: 'Error en el token' })
    }
}