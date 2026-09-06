import { ISocialAccount } from "../models/SocialAccount";
import { Classification } from "../models/Analysis";

export type DetectionResult = {
  riskScore: number;
  confidence: number;
  classification: Classification;
  featureScores: Record<string, number>;
  reasons: string[];
  modelVersion: string;
};

const clamp = (n: number) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));

export function detect(account: ISocialAccount): DetectionResult {
  const features: Record<string, number> = {};
  const reasons: string[] = [];

  features.accountAge = account.accountAgeDays < 30 ? 90 : account.accountAgeDays < 90 ? 55 : 10;
  if (features.accountAge >= 55) reasons.push("The account is relatively new.");

  const ratio = account.followers / Math.max(account.following, 1);
  features.followRatio = ratio < 0.1 ? 85 : ratio < 0.5 ? 55 : 10;
  if (features.followRatio >= 55) reasons.push("Follower/following behavior is unusually low.");

  features.postingFrequency = account.postsPerDay > 50 ? 95 : account.postsPerDay > 20 ? 70 : account.postsPerDay > 8 ? 40 : 5;
  if (features.postingFrequency >= 70) reasons.push("Posting frequency is unusually high.");

  features.profileCompleteness =
    (!account.hasProfilePicture ? 30 : 0) +
    (!account.hasBio ? 25 : 0) +
    (!account.hasWebsite ? 10 : 0);
  if (features.profileCompleteness >= 40) reasons.push("The profile has limited identifying information.");

  features.engagement = account.engagementRate < 0.5 ? 65 : account.engagementRate < 1 ? 35 : 5;
  if (features.engagement >= 35) reasons.push("Engagement rate is unusually low relative to activity.");

  features.duplicateContent = clamp(account.duplicateContentRatio * 100);
  if (features.duplicateContent >= 60) reasons.push("A high proportion of content appears repetitive or duplicated.");

  features.repetitiveContent = clamp(account.repetitiveContentScore);
  if (features.repetitiveContent >= 60) reasons.push("Content behavior is highly repetitive.");

  features.network = clamp(account.networkScore);
  if (features.network >= 70) reasons.push("Network behavior has elevated risk indicators.");

  features.activityPattern = account.activeHours < 2 ? 65 : account.activeHours > 20 ? 45 : 5;

  const values = Object.values(features);
  const riskScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const confidence = Math.round(Math.min(98, 55 + Math.abs(riskScore - 50) * 0.8));

  const classification: Classification =
    riskScore >= 80 ? "LIKELY_BOT" :
    riskScore >= 60 ? "HIGH_RISK" :
    riskScore >= 30 ? "SUSPICIOUS" : "GENUINE";

  return {
    riskScore,
    confidence,
    classification,
    featureScores: Object.fromEntries(Object.entries(features).map(([k, v]) => [k, Math.round(v)])),
    reasons: reasons.length ? reasons : ["No major rule-based risk indicators were detected."],
    modelVersion: "rules-v1"
  };
}
