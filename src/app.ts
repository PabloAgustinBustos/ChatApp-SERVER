import express from "express"

const app = express()

app.get("/", (req, res) => {
  res.send("ready")
})

app.use("/api/auth")
app.use("/api/messages")

export default app