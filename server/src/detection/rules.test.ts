import { describe, expect, it } from "vitest";
import { detect } from "./rules";
import {
  buildUrlDetectionReport,
  parseSocialAccountUrl,
} from "../utils/urlDetection";

const base: any = {
  accountAgeDays: 500,
  followers: 1000,
  following: 200,
  postsPerDay: 2,
  hasProfilePicture: true,
  hasBio: true,
  hasWebsite: true,
  engagementRate: 3,
  duplicateContentRatio: 0.05,
  activeHours: 8,
  repetitiveContentScore: 10,
  networkScore: 10,
};

describe("rule detector", () => {
  it("returns bounded scores", () => {
    const result = detect(base);
    expect(result.riskScore).toBeGreaterThanOrEqual(0);
    expect(result.riskScore).toBeLessThanOrEqual(100);
  });

  it("detects a high-risk synthetic profile", () => {
    const result = detect({
      ...base,
      accountAgeDays: 5,
      followers: 5,
      following: 1500,
      postsPerDay: 80,
      hasProfilePicture: false,
      hasBio: false,
      engagementRate: 0.1,
      duplicateContentRatio: 0.95,
      repetitiveContentScore: 95,
      networkScore: 90,
    });
    expect(["HIGH_RISK", "LIKELY_BOT"]).toContain(result.classification);
  });

  it("builds a detection report for a social profile URL", () => {
    const parsed = parseSocialAccountUrl("https://x.com/elonmusk");
    expect(parsed).not.toBeNull();
    const report = buildUrlDetectionReport(parsed!);
    expect(report.detected.platform).toBe("X");
    expect(report.detected.username).toBe("elonmusk");
    expect(report.report.classification).toBeDefined();
    expect(report.report.riskScore).toBeGreaterThanOrEqual(0);
    expect(report.report.riskScore).toBeLessThanOrEqual(100);
  });

  it("uses different risk baselines for different real social profiles", () => {
    const xReport = buildUrlDetectionReport(
      parseSocialAccountUrl("https://x.com/elonmusk")!,
    );
    const githubReport = buildUrlDetectionReport(
      parseSocialAccountUrl("https://github.com/octocat")!,
    );
    const threadsReport = buildUrlDetectionReport(
      parseSocialAccountUrl("https://threads.net/@dailyhustle")!,
    );

    const scores = [
      xReport.report.riskScore,
      githubReport.report.riskScore,
      threadsReport.report.riskScore,
    ];
    expect(new Set(scores).size).toBeGreaterThan(1);
    expect(scores.every((score) => score >= 0 && score <= 100)).toBe(true);
  });
});
