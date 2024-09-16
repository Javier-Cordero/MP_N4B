import { Router } from 'express'
import UserController from '../controller/user.controller.js'
const router = Router()
router.get('/',UserController.showUser)
router.get('/:id',UserController.userId)
router.post('/', UserController.store)
export default router;