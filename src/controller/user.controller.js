import User from '../model/User.js'
import path from 'path'
import fs from 'fs/promises'
import {compare} from 'bcrypt'
import jwt from 'jsonwebtoken'
import {JWT_SECRET} from '../config/config.js'
export default class UserController {
    static async postUser(req, res) {
        try {
            const { name, l_name, email, password, imagen } = req.body;
            const user = await User.create({ name, l_name, email, password, imagen });
            res.status(201).json({ message: 'Usuario creado', data: user })
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
    static async patchUser(req, res) {
        try {
            const { id } = req.params;
            const { name, l_name, email, password, imagen } = req.body;
            const user = await User.update({ id, name, l_name, email, password, imagen });
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
            if (user.affectedRows === 0) return res.status(404).json({ message: error.messages })
            res.json({ message: 'Usuario actualizado', data: user })
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
    static async deleted(req, res) {
        try {
            const { id } = req.params;
            const user = await User.delete(id);
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
            if (user.affectedRows === 0) return res.status(404).json({ message: 'Usuario ya fue eliminado' })
            res.json({ message: 'Usuario eliminado' })
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
    static async UserId(req, res) {
        try {
            const { id } = req.params;
            const user = await User.getId(id)
            if (user.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' })
            res.json(user)
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
    static async getUser(req, res) {
        try {
            const user = await User.all()
            res.json(user)
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
    static async Image(req, res) {
        try {
            const { name } = req.params;
            if (!name) return res.status(404).json({ message: 'poner nombre a la imagen' })
            const imagen = path.resolve(`./uploads/${name}`)
            await fs.access(imagen)
            res.sendFile(imagen)
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.getEmail(email)
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
            const esValido = await compare(password, user.password)
            if (!esValido) return res.status(401).json({ message: 'Credenciales inválidas' })
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })
            res.json({ message: 'Inicio de sesión exitoso', token })
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
    static async me(req, res) {
        try {
            res.json(req.user)
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
}