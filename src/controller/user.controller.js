import User from '../model/User.js'
export default class UserController {
    static async store(req, res) {
        try {
            const { name, l_name, email, password, imagen } = req.body;
            const user = await User.create({ name, l_name, email, password, imagen });
            res.status(201).json({ message: 'Usuario creado', data: user })
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
    static async showUser(req, res) {
        try {
            const usuario = await User.show()
            res.json(usuario)
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
    static async userId(req, res) {
        try {
            const usuario = await User.getById(req.params.id)
            if (usuario.length === 0) return res.status(404).json({ message: 'ususario no encontrado' })
            res.json(usuario)
        } catch (error) { res.status(500).json({ message: error.message }) }
    }
}