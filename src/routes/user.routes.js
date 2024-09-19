import { Router } from "express";
import UserController from '../controller/user.controller.js'
import { validarJWT } from "../middleware/auth.middleware.js";
const router = Router()

router.get('/', UserController.getUser)
router.post('/', UserController.postUser)
router.patch('/:id', UserController.patchUser)
router.delete('/:id', UserController.deleted)
router.get('/:id', UserController.UserId)
router.post('/login', UserController.login)
router.get('/me', validarJWT, UserController.me)
export default router;