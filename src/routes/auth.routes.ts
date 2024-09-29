import { Router } from "express";
import { getMe, login, logout, signup } from "../controllers/auth";
import protect from "../middlewares/protect";

const router = Router()

router.get("/me", protect, getMe)
router.post("/login", login)
router.post("/logout", logout)
router.post("/signup", signup)

export default router