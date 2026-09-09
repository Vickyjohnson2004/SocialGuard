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

const clamp = (n: number) =>
  Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));

export function detect(account: ISocialAccount): DetectionResult {
  const features: Record<string, number> = {};
  const reasons: string[] = [];

  const ratio = account.followers / Math.max(account.following, 1);
  features.accountAge =
    account.accountAgeDays < 30 ? 72 : account.accountAgeDays < 180 ? 38 : 12;
  if (features.accountAge >= 38) reasons.push("The account is relatively new.");

  features.followRatio = ratio < 0.15 ? 72 : ratio < 0.5 ? 38 : 8;
  if (features.followRatio >= 38)
    reasons.push("Follower/following behavior is unusually low.");

  features.postingFrequency =
    account.postsPerDay > 60
      ? 84
      : account.postsPerDay > 20
        ? 58
        : account.postsPerDay > 6
          ? 24
          : 6;
  if (features.postingFrequency >= 58)
    reasons.push("Posting frequency is unusually high.");

  features.profileCompleteness =
    (!account.hasProfilePicture ? 26 : 0) +
    (!account.hasBio ? 18 : 0) +
    (!account.hasWebsite ? 12 : 0);
  if (features.profileCompleteness >= 26)
    reasons.push("The profile has limited identifying information.");

  features.engagement =
    account.engagementRate < 0.35 ? 62 : account.engagementRate < 1.1 ? 30 : 8;
  if (features.engagement >= 30)
    reasons.push("Engagement rate is unusually low relative to activity.");

  features.duplicateContent = clamp(account.duplicateContentRatio * 100);
  if (features.duplicateContent >= 60)
    reasons.push(
      "A high proportion of content appears repetitive or duplicated.",
    );

  features.repetitiveContent = clamp(account.repetitiveContentScore);
  if (features.repetitiveContent >= 60)
    reasons.push("Content behavior is highly repetitive.");

  features.network = clamp(account.networkScore);
  if (features.network >= 70)
    reasons.push("Network behavior has elevated risk indicators.");

  features.activityPattern =
    account.activeHours < 2 || account.activeHours > 20 ? 36 : 10;

  let riskScore = Math.round(
    Object.values(features).reduce((sum, value) => sum + value, 0) /
      Object.keys(features).length,
  );

  if (account.isVerified) riskScore = Math.max(0, riskScore - 10);
  if (account.hasProfilePicture && account.hasBio && account.hasWebsite)
    riskScore = Math.max(0, riskScore - 8);
  if (
    account.followers > 10000 &&
    account.following > 100 &&
    account.engagementRate > 1.5
  )
    riskScore = Math.max(0, riskScore - 12);

  riskScore = clamp(riskScore);
  const confidence = Math.round(
    Math.min(98, 58 + Math.abs(riskScore - 50) * 0.8),
  );

  const classification: Classification =
    riskScore >= 80
      ? "LIKELY_BOT"
      : riskScore >= 60
        ? "HIGH_RISK"
        : riskScore >= 30
          ? "SUSPICIOUS"
          : "GENUINE";

  return {
    riskScore,
    confidence,
    classification,
    featureScores: Object.fromEntries(
      Object.entries(features).map(([k, v]) => [k, Math.round(v)]),
    ),
    reasons: reasons.length
      ? reasons
      : ["No major rule-based risk indicators were detected."],
    modelVersion: "rules-v1",
  };
}
