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

export function buildUrlDetectionReport(
  parsed: DetectedAccountUrl,
): UrlDetectionReport {
  const suggestedProfile = {
    platform: parsed.platform,
    username: parsed.username,
    followers: 0,
    following: 0,
    posts: 0,
    accountAgeDays: 30,
    hasProfilePicture: false,
    hasBio: false,
    hasWebsite: false,
    isVerified: false,
    averageLikes: 0,
    averageComments: 0,
    averageShares: 0,
    postsPerDay: 1,
    engagementRate: 1,
    duplicateContentRatio: 0,
    activeHours: 8,
    repetitiveContentScore: 0,
    networkScore: 0,
  };

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
