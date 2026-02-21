import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes"
import taskRoutes from "./routes/taskRoutes"

dotenv.config()

const app = express()

app.use(cors({ 
  origin:[ 
    "http://localhost:3000" , 
    "https://task-management-system-git-main-the-paranoid07s-projects.vercel.app/"
  ], 
  credentials: true }))


app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRoutes)
app.use("/tasks", taskRoutes)

app.listen(5000, () => {
  console.log("Server running on port 5000")
})