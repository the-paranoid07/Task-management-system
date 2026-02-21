"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../prisma");
const generateTokens_1 = require("../utils/generateTokens");
const register = async (req, res) => {
    const { email, password } = req.body;
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing)
        return res.status(400).json({ message: "User already exists" });
    const hashed = await bcrypt_1.default.hash(password, 10);
    await prisma_1.prisma.user.create({
        data: { email, password: hashed }
    });
    res.status(201).json({ message: "User registered" });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(400).json({ message: "Invalid credentials" });
    const valid = await bcrypt_1.default.compare(password, user.password);
    if (!valid)
        return res.status(400).json({ message: "Invalid credentials" });
    const accessToken = (0, generateTokens_1.generateAccessToken)(user.id);
    const refreshToken = (0, generateTokens_1.generateRefreshToken)(user.id);
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });
    res.json({ accessToken });
};
exports.login = login;
const refresh = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.status(401).json({ message: "No refresh token" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user || user.refreshToken !== token)
            return res.status(403).json({ message: "Invalid refresh token" });
        const newAccessToken = (0, generateTokens_1.generateAccessToken)(user.id);
        res.json({ accessToken: newAccessToken });
    }
    catch {
        return res.status(403).json({ message: "Invalid token" });
    }
};
exports.refresh = refresh;
const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.sendStatus(204);
    const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_SECRET);
    await prisma_1.prisma.user.update({
        where: { id: decoded.userId },
        data: { refreshToken: null }
    });
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map