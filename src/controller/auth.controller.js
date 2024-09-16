import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../model/User.js'

export default class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body
            const usuario = await User.getByEmail(email)
            if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })
            const esValido = await compare(password, usuario.password)
            if (!esValido) return res.status(401).json({ message: 'Credenciales inválidas' })
            const token = jwt.sign({ userId: usuario.user_id }, 'admin', { expiresIn: '1h' })
            res.json({ message: 'Inicio de sesión exitoso', token })
        } catch (error) { res.status(500).json({ message: error.message }) }
    }

    static async me(req, res) {
        try {
            delete req.user.password
            res.json(req.user)
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
}