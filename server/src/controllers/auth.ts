import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { env } from "../config/env";
import { signAccessToken, signRefreshToken, verifyRefresh } from "../utils/jwt";
import { loginSchema, registerSchema } from "../validators/auth";
import { ok } from "../utils/api";

const secureCookies = env.COOKIE_SECURE || env.NODE_ENV === "production";
const cookieSameSite: "none" | "lax" = secureCookies ? "none" : "lax";

const cookieBase = {
  httpOnly: true,
  secure: secureCookies,
  sameSite: cookieSameSite,
  path: "/",
};

export async function register(req: Request, res: Response) {
  const body = registerSchema.parse(req.body);
  const exists = await User.findOne({ email: body.email.toLowerCase() });
  if (exists)
    return res.status(409).json({
      success: false,
      message: "Email already registered",
      errors: [],
    });

  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await User.create({
    name: body.name,
    email: body.email,
    passwordHash,
    role: "USER",
  });
  const access = signAccessToken(user.id, user.role);
  const refresh = signRefreshToken(user.id, user.role);

  res.cookie("accessToken", access, { ...cookieBase, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refresh, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return ok(
    res,
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    "Registration successful",
    201,
  );
}

export async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);
  const user = await User.findOne({ email: body.email.toLowerCase() });
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
      errors: [],
    });
  }
  const access = signAccessToken(user.id, user.role);
  const refresh = signRefreshToken(user.id, user.role);
  res.cookie("accessToken", access, { ...cookieBase, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refresh, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return ok(
    res,
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    "Login successful",
  );
}

export async function refresh(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
        errors: [],
      });
    const payload = verifyRefresh(token);
    const user = await User.findById(payload.sub);
    if (!user) throw new Error("not found");
    const access = signAccessToken(user.id, user.role);
    res.cookie("accessToken", access, {
      ...cookieBase,
      maxAge: 15 * 60 * 1000,
    });
    return ok(res, null, "Session refreshed");
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh session", errors: [] });
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("accessToken", cookieBase);
  res.clearCookie("refreshToken", cookieBase);
  return ok(res, null, "Logged out");
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.user!.id).select(
    "name email role verified createdAt",
  );
  return ok(res, user);
}
