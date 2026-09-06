import { Request, Response } from "express";
import { Investigation } from "../models/Investigation";
import { ok } from "../utils/api";
import { z } from "zod";

export async function listInvestigations(req: Request, res: Response) {
  const filter = req.user!.role === "ADMIN" ? {} : { createdBy: req.user!.id };
  const items = await Investigation.find(filter).populate("accountId").populate("assignedTo", "name email").sort({ createdAt: -1 });
  return ok(res, items);
}

export async function createInvestigation(req: Request, res: Response) {
  const body = z.object({
    accountId: z.string(),
    analysisId: z.string().optional(),
    notes: z.string().max(5000).optional()
  }).parse(req.body);

  const investigation = await Investigation.create({
    accountId: body.accountId,
    analysisId: body.analysisId,
    createdBy: req.user!.id,
    notes: body.notes ? [{ text: body.notes, authorId: req.user!.id, createdAt: new Date() }] : []
  });
  return ok(res, investigation, "Investigation created", 201);
}

export async function updateInvestigation(req: Request, res: Response) {
  const body = z.object({
    status: z.enum(["OPEN", "UNDER_REVIEW", "CONFIRMED", "REJECTED", "RESOLVED"]).optional(),
    decision: z.string().max(5000).optional(),
    note: z.string().max(5000).optional()
  }).parse(req.body);

  const item = await Investigation.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Investigation not found", errors: [] });
  if (body.status) item.status = body.status;
  if (body.decision) item.decision = body.decision;
  if (body.note) item.notes.push({ text: body.note, authorId: req.user!.id as any, createdAt: new Date() });
  await item.save();
  return ok(res, item, "Investigation updated");
}
