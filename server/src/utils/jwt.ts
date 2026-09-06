import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type TokenPayload = { sub: string; role: string; type: "access" | "refresh" };

export function signAccessToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role, type: "access" }, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role, type: "refresh" }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccess(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefresh(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}
