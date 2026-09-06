import { Request, Response } from "express";
import { accountSchema } from "../validators/account";
import { SocialAccount } from "../models/SocialAccount";
import { Analysis } from "../models/Analysis";
import { detect } from "../detection/rules";
import { ok } from "../utils/api";

export async function createAnalysis(req: Request, res: Response) {
  const body = accountSchema.parse(req.body);
  const account = await SocialAccount.create({ ...body, createdBy: req.user!.id });
  const result = detect(account);
  const analysis = await Analysis.create({
    accountId: account.id,
    userId: req.user!.id,
    ...result
  });
  return ok(res, { account, analysis }, "Analysis completed", 201);
}

export async function listAnalyses(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const filter = req.user!.role === "ADMIN" ? {} : { userId: req.user!.id };
  const [items, total] = await Promise.all([
    Analysis.find(filter).populate("accountId").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Analysis.countDocuments(filter)
  ]);
  return ok(res, { items, page, limit, total, pages: Math.ceil(total / limit) });
}

export async function getAnalysis(req: Request, res: Response) {
  const item = await Analysis.findById(req.params.id).populate("accountId");
  if (!item) return res.status(404).json({ success: false, message: "Analysis not found", errors: [] });
  return ok(res, item);
}

export async function reanalyze(req: Request, res: Response) {
  const analysis = await Analysis.findById(req.params.id);
  if (!analysis) return res.status(404).json({ success: false, message: "Analysis not found", errors: [] });
  const account = await SocialAccount.findById(analysis.accountId);
  if (!account) return res.status(404).json({ success: false, message: "Account not found", errors: [] });
  const result = detect(account);
  Object.assign(analysis, result);
  await analysis.save();
  return ok(res, analysis, "Analysis refreshed");
}
