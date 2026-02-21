import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
export declare const createTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTasks: (req: AuthRequest, res: Response) => Promise<void>;
declare const _default: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export default _default;
export declare const deleteTask: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=taskController.d.ts.map