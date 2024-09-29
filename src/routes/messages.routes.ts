import { Router } from "express";

const router = Router()

router.get("/conversation", (req, res) => {
  res.send("conversations")
})

export default router