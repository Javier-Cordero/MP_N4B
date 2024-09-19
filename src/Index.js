import express from 'express'
import morgan from 'morgan'
import { PORT } from './config/config.js'
import router from './routes/user.routes.js'
import { validateCORS } from './middleware/middleware.js'
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(validateCORS)
app.use('/', router)
app.listen(PORT, () => console.log(`SERVER listening on localhost:${PORT}`)) 