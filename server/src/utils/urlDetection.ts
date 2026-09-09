import { detect } from "../detection/rules";

export type DetectedAccountUrl = {
  platform: string;
  username: string;
  normalizedUrl: string;
};

export type UrlDetectionReport = {
  detected: DetectedAccountUrl;
  suggestedProfile: {
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
  };
  report: {
    riskScore: number;
    confidence: number;
    classification: string;
    featureScores: Record<string, number>;
    reasons: string[];
    modelVersion: string;
  };
};

const socialPatterns: Array<{ platform: string; pattern: RegExp }> = [
  {
    platform: "X",
    pattern:
      /^(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/(?:@)?([^/?#]+)/i,
  },
  {
    platform: "Instagram",
    pattern: /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:@)?([^/?#]+)/i,
  },
  {
    platform: "TikTok",
    pattern: /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@?([^/?#]+)/i,
  },
  {
    platform: "YouTube",
    pattern: /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:@|user\/)?([^/?#]+)/i,
  },
  {
    platform: "Facebook",
    pattern:
      /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:profile\.php\?id=)?([^/?#]+)/i,
  },
  {
    platform: "LinkedIn",
    pattern: /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([^/?#]+)/i,
  },
  {
    platform: "Threads",
    pattern: /^(?:https?:\/\/)?(?:www\.)?threads\.net\/@?([^/?#]+)/i,
  },
  {
    platform: "GitHub",
    pattern: /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#]+)/i,
  },
];

export function parseSocialAccountUrl(
  input: string,
): DetectedAccountUrl | null {
  const raw = input?.trim();
  if (!raw) return null;

  const candidate =
    raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : `https://${raw}`;

  try {
    const url = new URL(candidate);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    const path = decodeURIComponent(url.pathname.replace(/^\/+|\/+$/g, ""));
    const normalizedPath = path.split("/").filter(Boolean)[0] ?? "";

    const directMatch = socialPatterns.find(({ pattern }) =>
      pattern.test(url.origin.toLowerCase() === "null" ? raw : hostname),
    );
    if (directMatch) {
      const username =
        (url.origin.toLowerCase() === "null" ? raw : path).match(
          directMatch.pattern,
        )?.[1] ?? normalizedPath;
      if (username) {
        return {
          platform: directMatch.platform,
          username: username.replace(/^@/, "").replace(/\/+$/, ""),
          normalizedUrl: normalizeUrl(url),
        };
      }
    }

    const fallback = socialPatterns.find(({ platform, pattern }) => {
      const match = candidate.match(pattern);
      return Boolean(match) && platform;
    });

    if (fallback) {
      const username = candidate.match(fallback.pattern)?.[1];
      if (username) {
        return {
          platform: fallback.platform,
          username: username.replace(/^@/, "").replace(/\/+$/, ""),
          normalizedUrl: normalizeUrl(url),
        };
      }
    }

    if (hostname.includes("x.com") || hostname.includes("twitter.com")) {
      const username = path.replace(/^@/, "").split("/")[0];
      if (username)
        return { platform: "X", username, normalizedUrl: normalizeUrl(url) };
    }

    if (hostname.includes("instagram.com")) {
      const username = path.replace(/^@/, "").split("/")[0];
      if (username)
        return {
          platform: "Instagram",
          username,
          normalizedUrl: normalizeUrl(url),
        };
    }

    if (hostname.includes("tiktok.com")) {
      const username = path.replace(/^@/, "").split("/")[0];
      if (username)
        return {
          platform: "TikTok",
          username,
          normalizedUrl: normalizeUrl(url),
        };
    }

    return null;
  } catch {
    return null;
  }
}

function getProfileDefaults(platform: string, username: string) {
  const lowerName = username.toLowerCase();
  const suspiciousName =
    /bot|spam|promo|viral|follow|earn|cash|giveaway|trade|click/i.test(
      lowerName,
    );

  const baseByPlatform: Record<string, any> = {
    X: {
      followers: 18400,
      following: 640,
      posts: 1280,
      accountAgeDays: 920,
      hasProfilePicture: true,
      hasBio: true,
      hasWebsite: true,
      isVerified: true,
      averageLikes: 780,
      averageComments: 140,
      averageShares: 95,
      postsPerDay: 11,
      engagementRate: 2.6,
      duplicateContentRatio: 0.08,
      activeHours: 9,
      repetitiveContentScore: 18,
      networkScore: 16,
    },
    Instagram: {
      followers: 22400,
      following: 710,
      posts: 960,
      accountAgeDays: 680,
      hasProfilePicture: true,
      hasBio: true,
      hasWebsite: false,
      isVerified: true,
      averageLikes: 580,
      averageComments: 96,
      averageShares: 72,
      postsPerDay: 7,
      engagementRate: 2.2,
      duplicateContentRatio: 0.12,
      activeHours: 8,
      repetitiveContentScore: 22,
      networkScore: 18,
    },
    TikTok: {
      followers: 9600,
      following: 420,
      posts: 460,
      accountAgeDays: 520,
      hasProfilePicture: true,
      hasBio: true,
      hasWebsite: false,
      isVerified: false,
      averageLikes: 920,
      averageComments: 88,
      averageShares: 110,
      postsPerDay: 14,
      engagementRate: 3.1,
      duplicateContentRatio: 0.14,
      activeHours: 10,
      repetitiveContentScore: 26,
      networkScore: 20,
    },
    YouTube: {
      followers: 31000,
      following: 180,
      posts: 520,
      accountAgeDays: 1100,
      hasProfilePicture: true,
      hasBio: true,
      hasWebsite: true,
      isVerified: true,
      averageLikes: 1400,
      averageComments: 210,
      averageShares: 160,
      postsPerDay: 4,
      engagementRate: 1.8,
      duplicateContentRatio: 0.06,
      activeHours: 7,
      repetitiveContentScore: 12,
      networkScore: 12,
    },
    Facebook: {
      followers: 12600,
      following: 530,
      posts: 680,
      accountAgeDays: 740,
      hasProfilePicture: true,
      hasBio: true,
      hasWebsite: false,
      isVerified: false,
      averageLikes: 430,
      averageComments: 52,
      averageShares: 74,
      postsPerDay: 5,
      engagementRate: 1.4,
      duplicateContentRatio: 0.09,
      activeHours: 8,
      repetitiveContentScore: 20,
      networkScore: 15,
    },
    LinkedIn: {
      followers: 18700,
      following: 470,
      posts: 340,
      accountAgeDays: 980,
      hasProfilePicture: true,
      hasBio: true,
      hasWebsite: true,
      isVerified: false,
      averageLikes: 530,
      averageComments: 92,
      averageShares: 76,
      postsPerDay: 3,
      engagementRate: 1.9,
      duplicateContentRatio: 0.07,
      activeHours: 6,
      repetitiveContentScore: 14,
      networkScore: 14,
    },
    Threads: {
      followers: 8600,
      following: 490,
      posts: 610,
      accountAgeDays: 540,
      hasProfilePicture: true,
      hasBio: true,
      hasWebsite: false,
      isVerified: false,
      averageLikes: 394,
      averageComments: 54,
      averageShares: 41,
      postsPerDay: 6,
      engagementRate: 2.0,
      duplicateContentRatio: 0.11,
      activeHours: 9,
      repetitiveContentScore: 24,
      networkScore: 19,
    },
    GitHub: {
      followers: 970,
      following: 180,
      posts: 210,
      accountAgeDays: 720,
      hasProfilePicture: true,
      hasBio: true,
      hasWebsite: true,
      isVerified: false,
      averageLikes: 0,
      averageComments: 0,
      averageShares: 0,
      postsPerDay: 2,
      engagementRate: 0.8,
      duplicateContentRatio: 0.04,
      activeHours: 8,
      repetitiveContentScore: 10,
      networkScore: 10,
    },
  };

  const profile = {
    ...(baseByPlatform[platform] || baseByPlatform.X),
    username,
    platform,
  };

  if (suspiciousName) {
    profile.followers = Math.max(120, Math.floor(profile.followers * 0.3));
    profile.following = Math.max(200, Math.floor(profile.following * 2.4));
    profile.hasProfilePicture = false;
    profile.hasBio = false;
    profile.hasWebsite = false;
    profile.postsPerDay = Math.max(18, profile.postsPerDay * 2);
    profile.duplicateContentRatio = 0.72;
    profile.repetitiveContentScore = 76;
    profile.networkScore = 82;
  }

  return profile;
}

export function buildUrlDetectionReport(
  parsed: DetectedAccountUrl,
): UrlDetectionReport {
  const suggestedProfile = getProfileDefaults(parsed.platform, parsed.username);

  const report = detect({
    ...suggestedProfile,
    _id: undefined,
    externalId: undefined,
    createdBy: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  } as any);

  return {
    detected: parsed,
    suggestedProfile,
    report: {
      riskScore: report.riskScore,
      confidence: report.confidence,
      classification: report.classification,
      featureScores: report.featureScores,
      reasons: report.reasons,
      modelVersion: report.modelVersion,
    },
  };
}

function normalizeUrl(url: URL) {
  const normalized = new URL(url.href);
  normalized.hash = "";
  normalized.search = "";
  return normalized.toString().replace(/\/$/, "");
}
