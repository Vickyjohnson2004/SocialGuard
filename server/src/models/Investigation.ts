import mongoose, { Schema, Document } from "mongoose";

export type InvestigationStatus = "OPEN" | "UNDER_REVIEW" | "CONFIRMED" | "REJECTED" | "RESOLVED";

export interface IInvestigation extends Document {
  accountId: mongoose.Types.ObjectId;
  analysisId?: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  status: InvestigationStatus;
  notes: { text: string; authorId: mongoose.Types.ObjectId; createdAt: Date }[];
  decision?: string;
}

const schema = new Schema<IInvestigation>({
  accountId: { type: Schema.Types.ObjectId, ref: "SocialAccount", required: true },
  analysisId: { type: Schema.Types.ObjectId, ref: "Analysis" },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["OPEN", "UNDER_REVIEW", "CONFIRMED", "REJECTED", "RESOLVED"], default: "OPEN" },
  notes: [{ text: String, authorId: { type: Schema.Types.ObjectId, ref: "User" }, createdAt: Date }],
  decision: String
}, { timestamps: true });

export const Investigation = mongoose.model<IInvestigation>("Investigation", schema);
