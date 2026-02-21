"use client"

import api from "@/lib/api"
import toast from "react-hot-toast"

export default function TaskCard({ task, refresh }: any) {
  const toggle = async () => {
  try {
    await api.patch(`/tasks/${task.id}/toggle`)
    toast.success("Task status updated")
    refresh()
  } catch {
    toast.error("Failed to update task")
  }
}

  const remove = async () => {
  try {
    await api.delete(`/tasks/${task.id}`)
    toast.success("Task deleted")
    refresh()
  } catch {
    toast.error("Failed to delete task")
  }
}

  return (
    <div className="border p-3 flex justify-between items-center">
      <div>
        <h2 className={task.status ? "line-through" : ""}>
          {task.title}
        </h2>
        <p className="text-sm text-gray-500">{task.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={toggle}
          className="bg-yellow-500 text-white px-2"
        >
          Toggle
        </button>
        <button
          onClick={remove}
          className="bg-red-500 text-white px-2"
        >
          Delete
        </button>
      </div>
    </div>
  )
}