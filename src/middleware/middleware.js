import { allowedOrigins } from '../config/config.js'
export const validateCORS = (req, res, next) => {
    try {
        const { origin } = req.headers
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin)
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            next()
        } else res.status(403).json({ message: 'Access denied' })
    } catch (error) { res.status(500).json({ message: error.message }) }
}