import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt";
import { User, Role } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role; email: string };
    }
  }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ success: false, message: "Authentication required", errors: [] });
    const payload = verifyAccess(token);
    const user = await User.findById(payload.sub).select("email role");
    if (!user) return res.status(401).json({ success: false, message: "User not found", errors: [] });
    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired session", errors: [] });
  }
}

export function roles(...allowed: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Insufficient permissions", errors: [] });
    }
    next();
  };
}
