import { pool } from '../config/db.js'
import { hash } from 'bcrypt'
import validator from 'validator'
export default class User {
    static async create({ name, l_name, email, password, image }) {
        try {
            const [existe] = await pool.execute('SELECT email FROM user WHERE email = ?', [email])
            if (existe.length > 0) throw new Error('El correo electrónico ya está en uso.')
            const obligatories = ['name', 'l_name', 'email', 'password']
            const encrypted = await bcrypt.hash(password, 10)
            const guardary = [name, l_name, email, encrypted]
            const { isEmail } = validator
            if (!isEmail(email)) throw new Error('Correo electrónico inválido.')
            if (password.length < 8 || !/[A-Z]/.test(password)) throw new Error('La contraseña debe tener al menos 8 caracteres y una letra mayúscula.')
            if (image) {
                obligatories.push('image')
                guardary.push(image)
            }
            const stringObligatory = obligatories.join(', ')
            const placeholders = obligatories.map(() => '?').join(', ')
            const query = `INSERT INTO user(${stringObligatory}) VALUES (${placeholders})`
            const user = await pool.execute(query, guardary)
            return user
        } catch (error) { console.error({ message: error.message }) }
    }
    static async show() {
        const [usuario] = await pool.execute('SELECT name, l_name, email, password, image FROM users')
        return usuario
    }
    static async getById(id) {
        const [usuario] = await pool.execute('SELECT name, l_name, email, password, image FROM users WHERE user_id =?', [id])
        return usuario
    }
    static async where(campo, valor) {
        const [usuario] = await pool.execute(`SELECT name, l_name, email, password, image FROM users WHERE ${campo} =?`, [valor])
        return usuario
    }
    static async updateById({ id, name, l_name, email, password, image }) {
        const encrypted = await hash(password, 10)
        const [usuario] = await pool.execute(`UPDATE user SET name =?, l_name =?, email =?, password =?, image =? WHERE user_id =?`, [name, l_name, email, encrypted, image, id])
        return usuario
    }
    static async getByEmail(email) {
        try {
            const [usuario] = await pool.execute(`SELECT user_id, name, email, password, image FROM user WHERE name = ?`, [email])
            return usuario
        } catch (error) { console.error({ message: error.message }) }
    }
}