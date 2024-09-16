import User from '../model/User.js'
import jwt from 'jsonwebtoken'
export const validateJWT = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    const decodificado = jwt.verify(authorization, 'admin')
    const usuario = await User.getById(decodificado.userId)
    if (usuario.length === 0) return res.status(404).json({ message: 'el token no pertenece a ningún usuario ' })
    req.user = usuario[0]
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) return res.status(400).json({ message: 'Token expirado' })
    res.status(500).json({ message: 'Error al validar el token' })
  }
}
