import { Router } from "express";
import UserController from '../controller/user.controller.js'

const router = Router()

router.get('/', UserController.getUser)
router.post('/', UserController.postUser)
router.patch('/:id', UserController.patchUser)
router.delete('/:id', UserController.deleted)
export default router;