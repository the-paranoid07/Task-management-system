"use client"

import { useState } from "react"
import api from "@/lib/api"
import toast from "react-hot-toast"

export default function TaskForm({ onSuccess }: any) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async () => {
  try {
    await api.post("/tasks", { title, description })
    toast.success("Task added successfully")
    setTitle("")
    setDescription("")
    onSuccess()
  } catch {
    toast.error("Failed to add task")
  }
}

  return (
    <div className="flex flex-col gap-2 mb-4">
      <input
        className="border p-2"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2"
      >
        Add Task
      </button>
    </div>
  )
}