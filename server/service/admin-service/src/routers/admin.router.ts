import { Router } from "express";
import { adminLogin, createUser, deleteUser, editUser, getLoggedInAdmin, getUserData } from "../controllers/admin.controller";

const router = Router()

router.post('/login', adminLogin)
router.get('/fetchAllUsers', getUserData)
router.delete('/delete-user/:id',deleteUser)
router.get('/', getLoggedInAdmin)
router.post('/create-user',createUser)
router.post('/edit-user/:id', editUser)
export default router