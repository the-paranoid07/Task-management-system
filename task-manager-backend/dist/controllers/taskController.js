"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.getTasks = exports.createTask = void 0;
const prisma_1 = require("../prisma");
const createTask = async (req, res) => {
    const { title, description } = req.body;
    const task = await prisma_1.prisma.task.create({
        data: {
            title,
            description,
            userId: req.user.userId
        }
    });
    res.status(201).json(task);
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = typeof req.query.status === "string"
        ? req.query.status === "true"
        : undefined;
    const search = typeof req.query.search === "string"
        ? req.query.search
        : undefined;
    const where = {
        userId: req.user.userId
    };
    if (status !== undefined) {
        where.status = status;
    }
    if (search) {
        where.title = {
            contains: search
        };
    }
    const tasks = await prisma_1.prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit
    });
    res.json(tasks);
};
exports.getTasks = getTasks;
exports.default = async (req, res) => {
    const id = typeof req.params.id === "string"
        ? req.params.id
        : undefined;
    if (!id) {
        return res.status(400).json({ message: "Invalid task id" });
    }
    const task = await prisma_1.prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== req.user.userId)
        return res.status(404).json({ message: "Task not found" });
    const updated = await prisma_1.prisma.task.update({
        where: { id },
        data: { status: !task.status }
    });
    res.json(updated);
};
const deleteTask = async (req, res) => {
    const id = typeof req.params.id === "string"
        ? req.params.id
        : undefined;
    if (!id) {
        return res.status(400).json({ message: "Invalid task id" });
    }
    await prisma_1.prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted" });
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=taskController.js.map