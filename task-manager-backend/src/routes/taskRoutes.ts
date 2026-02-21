import { Router } from "express"
import { authenticate } from "../middleware/authMiddleware"
import toggleTask, { createTask, getTasks, deleteTask } from "../controllers/taskController"

const router = Router()

router.use(authenticate)

router.post("/", createTask)
router.get("/", getTasks)
router.patch("/:id/toggle", toggleTask)
router.delete("/:id", deleteTask)

export default router