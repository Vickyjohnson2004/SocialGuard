export type Classification = "GENUINE" | "SUSPICIOUS" | "HIGH_RISK" | "LIKELY_BOT";

export interface AccountInput {
  platform: string;
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
}
