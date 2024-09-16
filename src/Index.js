import express from 'express'
import morgan from 'morgan'
import { PORT } from './config/config.js'
import { validateCORS, handleError } from './middleware/middleware.js'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(validateCORS)
app.use('/user', userRouter)
app.use('/auth', authRouter)
app.use((req, res, next) => { res.status(404).json({ message: 'Invalid' }) })
app.use(handleError)
app.listen(PORT, () => console.log(`SERVER listening on localhost:${PORT}`)) 