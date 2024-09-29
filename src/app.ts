import express from "express"
import authRoutes from "./routes/auth.routes"
import messageRoutes from "./routes/messages.routes"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("ready")
})

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

export default app