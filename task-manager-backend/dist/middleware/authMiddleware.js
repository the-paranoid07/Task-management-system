"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_SECRET = process.env.ACCESS_SECRET;
if (!ACCESS_SECRET) {
    throw new Error("ACCESS_SECRET is not defined in .env");
}
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_SECRET);
        if (!decoded || typeof decoded !== "object" || !decoded.userId) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = { userId: decoded.userId };
        next();
    }
    catch {
        return res.status(403).json({ message: "Invalid token" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authMiddleware.js.map