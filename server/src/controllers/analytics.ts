import { Request, Response } from "express";
import { Analysis } from "../models/Analysis";
import { ok } from "../utils/api";

export async function dashboardAnalytics(req: Request, res: Response) {
  const base = req.user!.role === "ADMIN" ? {} : { userId: req.user!.id };
  const [distribution, platforms, average] = await Promise.all([
    Analysis.aggregate([
      { $match: base },
      { $group: { _id: "$classification", count: { $sum: 1 } } },
      { $project: { _id: 0, classification: "$_id", count: 1 } }
    ]),
    Analysis.aggregate([
      { $match: base },
      { $lookup: { from: "socialaccounts", localField: "accountId", foreignField: "_id", as: "account" } },
      { $unwind: "$account" },
      { $group: { _id: "$account.platform", count: { $sum: 1 } } },
      { $project: { _id: 0, platform: "$_id", count: 1 } }
    ]),
    Analysis.aggregate([
      { $match: base },
      { $group: { _id: null, averageRisk: { $avg: "$riskScore" }, total: { $sum: 1 } } }
    ])
  ]);
  return ok(res, { distribution, platforms, summary: average[0] || { averageRisk: 0, total: 0 } });
}
