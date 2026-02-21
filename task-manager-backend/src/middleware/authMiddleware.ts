import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

export interface AuthRequest extends Request {
  user?: { userId: string }
}

const ACCESS_SECRET = process.env.ACCESS_SECRET!

if (!ACCESS_SECRET) {
  throw new Error("ACCESS_SECRET is not defined in .env")
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader)
    return res.status(401).json({ message: "Unauthorized" })

  const token = authHeader.split(" ")[1]

  if (!token)
    return res.status(401).json({ message: "Unauthorized" })

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return res.status(403).json({ message: "Invalid token" })
    }

    req.user = { userId: decoded.userId as string }

    next()
  } catch {
    return res.status(403).json({ message: "Invalid token" })
  }
}