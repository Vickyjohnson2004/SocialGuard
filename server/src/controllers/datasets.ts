import { Request, Response } from "express";
import { SocialAccount } from "../models/SocialAccount";
import { Analysis } from "../models/Analysis";
import { detect } from "../detection/rules";
import { ok } from "../utils/api";

export async function uploadDataset(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ success: false, message: "CSV file is required", errors: [] });
  if (!req.file.originalname.toLowerCase().endsWith(".csv")) {
    return res.status(400).json({ success: false, message: "Only CSV files are accepted", errors: [] });
  }

  const text = req.file.buffer.toString("utf8");
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2 || lines.length > 5001) {
    return res.status(400).json({ success: false, message: "CSV must contain 1-5000 data rows", errors: [] });
  }

  const headers = lines[0].split(",").map(x => x.trim());
  const required = ["platform", "username", "followers", "following", "posts", "accountAgeDays", "postsPerDay", "engagementRate"];
  const missing = required.filter(x => !headers.includes(x));
  if (missing.length) return res.status(400).json({ success: false, message: `Missing columns: ${missing.join(", ")}`, errors: [] });

  let created = 0;
  for (const line of lines.slice(1)) {
    const values = line.split(",");
    const row: any = {};
    headers.forEach((h, i) => row[h] = values[i]?.trim());
    const body = {
      ...row,
      followers: Number(row.followers || 0),
      following: Number(row.following || 0),
      posts: Number(row.posts || 0),
      accountAgeDays: Number(row.accountAgeDays || 0),
      postsPerDay: Number(row.postsPerDay || 0),
      engagementRate: Number(row.engagementRate || 0),
      duplicateContentRatio: Number(row.duplicateContentRatio || 0),
      activeHours: Number(row.activeHours || 8),
      repetitiveContentScore: Number(row.repetitiveContentScore || 0),
      networkScore: Number(row.networkScore || 0),
      hasProfilePicture: row.hasProfilePicture === "true",
      hasBio: row.hasBio === "true",
      hasWebsite: row.hasWebsite === "true",
      isVerified: row.isVerified === "true"
    };
    const account = await SocialAccount.create({ ...body, createdBy: req.user!.id });
    const result = detect(account);
    await Analysis.create({ accountId: account.id, userId: req.user!.id, ...result });
    created++;
  }
  return ok(res, { rowsProcessed: created }, "Dataset processed");
}
