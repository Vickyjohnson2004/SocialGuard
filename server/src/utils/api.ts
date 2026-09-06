import { Response } from "express";

export function ok(res: Response, data: unknown, message = "Success", status = 200) {
  return res.status(status).json({ success: true, data, message });
}
