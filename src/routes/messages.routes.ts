import { Router } from "express";
import protect from "../middlewares/protect";
import { sendMessage } from "../controllers/messages";

const router = Router()

router.get("/conversation", (req, res) => {
  res.send("conversations")
})

router.post("/send/:id", protect, sendMessage)

export default router