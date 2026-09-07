import { Request, Response } from "express";
import { SocialAccount } from "../models/SocialAccount";
import { Analysis } from "../models/Analysis";
import { detect } from "../detection/rules";
import { accountSchema } from "../validators/account";
import { ok } from "../utils/api";

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += character;
    }
  }
  values.push(value.trim());
  return values;
}

export async function uploadDataset(req: Request, res: Response) {
  if (!req.file)
    return res
      .status(400)
      .json({ success: false, message: "CSV file is required", errors: [] });
  if (!req.file.originalname.toLowerCase().endsWith(".csv")) {
    return res.status(400).json({
      success: false,
      message: "Only CSV files are accepted",
      errors: [],
    });
  }

  const text = req.file.buffer.toString("utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2 || lines.length > 5001) {
    return res.status(400).json({
      success: false,
      message: "CSV must contain 1-5000 data rows",
      errors: [],
    });
  }

  const headers = parseCsvLine(lines[0]);
  const required = [
    "platform",
    "username",
    "followers",
    "following",
    "posts",
    "accountAgeDays",
    "postsPerDay",
    "engagementRate",
  ];
  const missing = required.filter((x) => !headers.includes(x));
  if (missing.length)
    return res.status(400).json({
      success: false,
      message: `Missing columns: ${missing.join(", ")}`,
      errors: [],
    });

  const rows = [];
  for (const [index, line] of lines.slice(1).entries()) {
    const values = parseCsvLine(line);
    const row: any = {};
    headers.forEach((h, i) => (row[h] = values[i]?.trim()));
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
      isVerified: row.isVerified === "true",
    };
    const parsed = accountSchema.safeParse(body);
    if (!parsed.success) {
      const fields = parsed.error.issues
        .map((issue) => issue.path.join(".") || "row")
        .join(", ");
      return res.status(400).json({
        success: false,
        message: `Invalid data on CSV row ${index + 2}: ${fields}`,
        errors: parsed.error.issues,
      });
    }
    rows.push(parsed.data);
  }

  const results = [];
  for (const body of rows) {
    const account = await SocialAccount.create({
      ...body,
      createdBy: req.user!.id,
    });
    const result = detect(account);
    const analysis = await Analysis.create({
      accountId: account.id,
      userId: req.user!.id,
      ...result,
    });
    results.push({
      username: account.username,
      platform: account.platform,
      riskScore: analysis.riskScore,
      confidence: analysis.confidence,
      classification: analysis.classification,
      reasons: analysis.reasons,
    });
  }
  return ok(
    res,
    { rowsProcessed: results.length, results },
    "Dataset processed",
  );
}
