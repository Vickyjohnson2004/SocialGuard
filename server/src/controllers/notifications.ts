import { Request, Response } from "express";
import { Notification } from "../models/Notification";
import { ok } from "../utils/api";

export async function notifications(req: Request, res: Response) {
  const items = await Notification.find({ userId: req.user!.id }).sort({ createdAt: -1 }).limit(50);
  return ok(res, items);
}
