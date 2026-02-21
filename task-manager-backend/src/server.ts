import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes"
import taskRoutes from "./routes/taskRoutes"

dotenv.config()

const app = express()


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://task-management-system-nu-five.vercel.app/"
    ],
    credentials: true
  })
)

app.options("*", cors())


app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRoutes)
app.use("/tasks", taskRoutes)

app.listen(5000, () => {
  console.log("Server running on port 5000")
})