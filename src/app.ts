import express from "express"
import authRoutes from "./routes/auth.routes"
import messageRoutes from "./routes/message.routes"

const app = express()

app.get("/", (req, res) => {
  res.send("ready")
})

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

export default app