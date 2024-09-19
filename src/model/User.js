import { pool } from '../config/db.js'
import { hash } from 'bcrypt'
import validator from 'validator'
export default class User {
    static async create({ name, l_name, email, password, image }) {
        try {
            const [existe] = await pool.execute('SELECT email FROM user WHERE email = ?', [email])
            if (existe.length > 0) throw new Error('El correo electrónico ya está en uso.')
            const obligatories = ['name', 'l_name', 'email', 'password']
            const encrypted = await hash(password, 10)
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
    static async update({ id, name, l_name, email, password, image }) {
        let query = 'UPDATE user SET '
        const campo = []
        const valor = []
        if (name) {
            campo.push('name=?')
            valor.push(name)
        }
        if (l_name) {
            campo.push('l_name=?')
            valor.push(l_name)
        }
        if (email) {
            campo.push('email=?')
            valor.push(email)
        }
        if (password) {
            campo.push('password=?')
            const encrypted = await hash(password, 10)
            valor.push(encrypted)
        }
        if (image) {
            campo.push('image=?')
            valor.push(image)
        }
        if (campo.length === 0) return undefined
        query += campo.join(', ') + ' WHERE user_id = ?'
        valor.push(id)
        const [resultado] = await pool.execute(query, valor)
        return resultado
    }
    static async delete(id) {
        const [resultado] = await pool.execute('DELETE FROM user WHERE user_id=?', [id])
        return resultado
    }
    static async all() {
        const [usuario] = await pool.execute('SELECT name, l_name, email, image FROM user')
        return usuario
    }
    static async getId(id) {
        const [usuario] = await pool.execute('SELECT name, l_name, email, image FROM user WHERE user_id =?', [id])
        return usuario
    }
    static async getEmail(email) {
        const [usuario] = await pool.execute('SELECT name, l_name, email, image FROM users WHERE email =?', [email])
        return usuario
    }
    static async search(campo, valor) {
        const [usuario] = await pool.execute(`SELECT name, l_name, email, image FROM user WHERE ${campo} =?`, [valor])
        return usuario
    }
}