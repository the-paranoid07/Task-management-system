"use client"

import { useState } from "react"
import api, { setAccessToken } from "@/lib/api"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleLogin = async () => {
        try {
            const res = await api.post("/auth/login", { email, password })
            setAccessToken(res.data.accessToken)
            toast.success("Login successful")
            router.push("/dashboard")
        } catch {
            toast.error("Invalid credentials")
        }
    }

    return (
        <div className="flex flex-col gap-4 p-10 max-w-sm mx-auto">
            <h1 className="text-xl font-semibold text-center">Login</h1>

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
                onClick={handleLogin}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Login
            </button>

            <div className="text-sm text-center mt-4">
                Not registered?{" "}
                <Link
                    href="/register"
                    className="text-blue-500 underline hover:text-blue-700"
                >
                    Register now
                </Link>
            </div>
        </div>
    )
}