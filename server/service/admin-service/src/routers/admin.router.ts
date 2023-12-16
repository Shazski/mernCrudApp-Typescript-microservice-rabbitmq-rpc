import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  createUser,
  deleteUser,
  editUser,
  getLoggedInAdmin,
  getUserData,
  getUserDetailsWithId,
} from "../controllers/admin.controller";

const router = Router();

router.post("/login", adminLogin);
router.get("/fetchAllUsers", getUserData);
router.delete("/delete-user/:id", deleteUser);
router.get("/", getLoggedInAdmin);
router.post("/create-user", createUser);
router.post("/edit-user/:id", editUser);
router.get("/get-user-details/:id", getUserDetailsWithId);
router.get('/logout', adminLogout)

export default router;
