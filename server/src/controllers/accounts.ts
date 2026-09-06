import { Request, Response } from "express";
import { SocialAccount } from "../models/SocialAccount";
import { ok } from "../utils/api";

export async function listAccounts(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const q = String(req.query.q || "").trim();
  const filter: any = req.user!.role === "ADMIN" ? {} : { createdBy: req.user!.id };
  if (q) filter.username = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  const [items, total] = await Promise.all([
    SocialAccount.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    SocialAccount.countDocuments(filter)
  ]);
  return ok(res, { items, page, limit, total, pages: Math.ceil(total / limit) });
}

export async function getAccount(req: Request, res: Response) {
  const item = await SocialAccount.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Account not found", errors: [] });
  return ok(res, item);
}
