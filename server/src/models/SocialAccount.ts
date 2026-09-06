import mongoose, { Schema, Document } from "mongoose";

export interface ISocialAccount extends Document {
  platform: string;
  externalId?: string;
  username: string;
  followers: number;
  following: number;
  posts: number;
  accountAgeDays: number;
  hasProfilePicture: boolean;
  hasBio: boolean;
  hasWebsite: boolean;
  isVerified: boolean;
  averageLikes: number;
  averageComments: number;
  averageShares: number;
  postsPerDay: number;
  engagementRate: number;
  duplicateContentRatio: number;
  activeHours: number;
  repetitiveContentScore: number;
  networkScore: number;
  createdBy: mongoose.Types.ObjectId;
}

const schema = new Schema<ISocialAccount>({
  platform: { type: String, required: true, index: true },
  externalId: String,
  username: { type: String, required: true, index: true },
  followers: { type: Number, min: 0, default: 0 },
  following: { type: Number, min: 0, default: 0 },
  posts: { type: Number, min: 0, default: 0 },
  accountAgeDays: { type: Number, min: 0, default: 0 },
  hasProfilePicture: Boolean,
  hasBio: Boolean,
  hasWebsite: Boolean,
  isVerified: Boolean,
  averageLikes: { type: Number, min: 0, default: 0 },
  averageComments: { type: Number, min: 0, default: 0 },
  averageShares: { type: Number, min: 0, default: 0 },
  postsPerDay: { type: Number, min: 0, default: 0 },
  engagementRate: { type: Number, min: 0, default: 0 },
  duplicateContentRatio: { type: Number, min: 0, max: 1, default: 0 },
  activeHours: { type: Number, min: 0, max: 24, default: 8 },
  repetitiveContentScore: { type: Number, min: 0, max: 100, default: 0 },
  networkScore: { type: Number, min: 0, max: 100, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }
}, { timestamps: true });

schema.index({ platform: 1, username: 1 });

export const SocialAccount = mongoose.model<ISocialAccount>("SocialAccount", schema);
