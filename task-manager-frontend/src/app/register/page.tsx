"use client"

import { useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import Link from "next/link"

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleRegister = async () => {
        try {
            await api.post("/auth/register", { email, password })
            toast.success("Account created")
            router.push("/login")
        } catch {
            toast.error("Registration failed")
        }
    }

    return (
        <div className="flex flex-col gap-4 p-10 max-w-sm mx-auto">
            <h1 className="text-xl">Register</h1>
            <input
                className="border p-2"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                className="border p-2"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleRegister}
                className="bg-green-500 text-white p-2"
            >
                Register
            </button>
            <div className="text-sm text-center mt-4">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-blue-500 underline hover:text-blue-700"
                >
                    Login here
                </Link>
            </div>
        </div>
    )
}