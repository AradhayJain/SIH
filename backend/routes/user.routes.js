import express from "express"
import { protect } from "../middlewares/authMiddleware.js"
import { allUsers, editProfile, loginUser, registerUser } from "../controllers/user.controller.js"

const router = express.Router()
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/",protect,allUsers);
router.put("/:id",protect,editProfile);

export default router;