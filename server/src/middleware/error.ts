import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, message: "Validation failed", errors: err.issues });
  }
  console.error(err);
  return res.status(500).json({ success: false, message: "Internal server error", errors: [] });
}
