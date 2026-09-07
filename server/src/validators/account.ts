import { z } from "zod";

const nonNegative = z.number().finite().min(0);

export const accountSchema = z.object({
  platform: z.string().trim().min(1).max(50),
  externalId: z.string().max(200).optional(),
  username: z.string().min(1).max(100),
  followers: nonNegative.default(0),
  following: nonNegative.default(0),
  posts: nonNegative.default(0),
  accountAgeDays: nonNegative.default(0),
  hasProfilePicture: z.boolean().default(false),
  hasBio: z.boolean().default(false),
  hasWebsite: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  averageLikes: nonNegative.default(0),
  averageComments: nonNegative.default(0),
  averageShares: nonNegative.default(0),
  postsPerDay: nonNegative.default(0),
  engagementRate: nonNegative.default(0),
  duplicateContentRatio: z.number().finite().min(0).max(1).default(0),
  activeHours: z.number().finite().min(0).max(24).default(8),
  repetitiveContentScore: z.number().finite().min(0).max(100).default(0),
  networkScore: z.number().finite().min(0).max(100).default(0),
});
