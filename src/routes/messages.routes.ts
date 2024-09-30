import { Router } from "express";
import protect from "../middlewares/protect";
import { getConversations, getMessages, sendMessage } from "../controllers/messages";

const router = Router()

router.get("/conversation", protect, getConversations)
router.get("/:id", protect, getMessages)
router.post("/send/:id", protect, sendMessage)

export default router