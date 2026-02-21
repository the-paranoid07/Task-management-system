import { Response } from "express"
import { prisma } from "../prisma"
import { AuthRequest } from "../middleware/authMiddleware"

export const createTask = async (req: AuthRequest, res: Response) => {
    const { title, description } = req.body

    const task = await prisma.task.create({
        data: {
            title,
            description,
            userId: req.user!.userId
        }
    })

    res.status(201).json(task)
}


export const getTasks = async (req: AuthRequest, res: Response) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    const status =
        typeof req.query.status === "string"
            ? req.query.status === "true"
            : undefined

    const search =
        typeof req.query.search === "string"
            ? req.query.search
            : undefined

    const where: any = {
        userId: req.user!.userId
    }

    if (status !== undefined) {
        where.status = status
    }

    if (search) {
        where.title = {
        contains: search
        }
    }

    const tasks = await prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit
    })

    res.json(tasks)
}

export default async (req: AuthRequest, res: Response) => {
    const id =
  typeof req.params.id === "string"
    ? req.params.id
    : undefined

    if (!id) {
  return res.status(400).json({ message: "Invalid task id" })
}

    const task = await prisma.task.findUnique({ where: { id } })
    if (!task || task.userId !== req.user!.userId)
        return res.status(404).json({ message: "Task not found" })

    const updated = await prisma.task.update({
        where: { id },
        data: { status: !task.status }
    })

    res.json(updated)
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
    const id =
  typeof req.params.id === "string"
    ? req.params.id
    : undefined

    if (!id) {
  return res.status(400).json({ message: "Invalid task id" })
}

    await prisma.task.delete({ where: { id } })
    res.json({ message: "Task deleted" })
}