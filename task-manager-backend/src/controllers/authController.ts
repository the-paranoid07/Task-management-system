import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../prisma"
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens"

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing)
    return res.status(400).json({ message: "User already exists" })

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { email, password: hashed }
  })

  res.status(201).json({ message: "User registered" })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user)
    return res.status(400).json({ message: "Invalid credentials" })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid)
    return res.status(400).json({ message: "Invalid credentials" })

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  })

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  })

  res.json({ accessToken })
}

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken
  if (!token)
    return res.status(401).json({ message: "No refresh token" })

  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_SECRET!
    ) as { userId: string }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Invalid refresh token" })

    const newAccessToken = generateAccessToken(user.id)

    res.json({ accessToken: newAccessToken })
  } catch {
    return res.status(403).json({ message: "Invalid token" })
  }
}

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken
  if (!token) return res.sendStatus(204)

  const decoded = jwt.verify(
    token,
    process.env.REFRESH_SECRET!
  ) as { userId: string }

  await prisma.user.update({
    where: { id: decoded.userId },
    data: { refreshToken: null }
  })

  res.clearCookie("refreshToken")
  res.json({ message: "Logged out" })
}