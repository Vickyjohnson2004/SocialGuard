import mongoose, { Schema, Document } from "mongoose";

export type Classification = "GENUINE" | "SUSPICIOUS" | "HIGH_RISK" | "LIKELY_BOT";

export interface IAnalysis extends Document {
  accountId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  riskScore: number;
  confidence: number;
  classification: Classification;
  featureScores: Record<string, number>;
  reasons: string[];
  modelVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IAnalysis>({
  accountId: { type: Schema.Types.ObjectId, ref: "SocialAccount", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  riskScore: { type: Number, min: 0, max: 100, required: true },
  confidence: { type: Number, min: 0, max: 100, required: true },
  classification: { type: String, enum: ["GENUINE", "SUSPICIOUS", "HIGH_RISK", "LIKELY_BOT"], required: true },
  featureScores: { type: Schema.Types.Mixed, default: {} },
  reasons: { type: [String], default: [] },
  modelVersion: { type: String, default: "rules-v1" }
}, { timestamps: true });

export const Analysis = mongoose.model<IAnalysis>("Analysis", schema);
