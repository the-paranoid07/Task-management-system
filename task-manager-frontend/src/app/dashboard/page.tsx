"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import TaskCard from "@/components/TaskCard"
import TaskForm from "@/components/TaskForm"
import { useRouter } from "next/navigation"
import { clearAccessToken } from "@/lib/api"
import toast from "react-hot-toast"

export default function Dashboard() {
    const [tasks, setTasks] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")
    const [page, setPage] = useState(1)
    const router = useRouter()

    const fetchTasks = async () => {
        const res = await api.get("/tasks", {
            params: { search, status, page, limit: 5 }
        })
        setTasks(res.data)
    }

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout")
            clearAccessToken()
            toast.success("Logged out successfully")
            router.push("/login")
        } catch {
            toast.error("Logout failed")
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [search, status, page])

    useEffect(() => {
        setPage(1)
    }, [search, status])

    return (
        <div className="p-10 max-w-2xl mx-auto">
            <h1 className="text-2xl mb-4">Task Dashboard</h1>

            <TaskForm onSuccess={fetchTasks} />

            <div className="flex gap-2 mb-4">
                <input
                    className="border p-2 flex-1"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="border p-2"
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="true">Completed</option>
                    <option value="false">Pending</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        refresh={fetchTasks}
                    />
                ))}

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="border px-3 py-1"
                    >
                        Prev
                    </button>

                    <span>Page {page}</span>

                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="border px-3 py-1"
                    >
                        Next
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}