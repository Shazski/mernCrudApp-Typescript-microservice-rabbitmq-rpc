import { Router } from "express";
import { editCurrentUser, getLoggedInUserData, logoutUser, userLogin, userRegister } from "../controllers/user.controller";
import { verifyUser } from "../middleware/authorization.middleware";
const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get('/',getLoggedInUserData)
router.get('/logout',verifyUser,logoutUser)
router.post('/edit-user',verifyUser, editCurrentUser)

export default router;
