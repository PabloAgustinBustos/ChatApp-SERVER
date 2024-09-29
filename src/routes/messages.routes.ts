import { Router } from "express";
import protect from "../middlewares/protect";
import { getMessages, sendMessage } from "../controllers/messages";

const router = Router()

router.get("/conversation", (req, res) => {
  res.send("conversations")
})

router.post("/send/:id", protect, sendMessage)
router.get("/:id", protect, getMessages)

export default router