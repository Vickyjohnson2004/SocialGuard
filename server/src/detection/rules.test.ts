import { describe, expect, it } from "vitest";
import { detect } from "./rules";

const base: any = {
  accountAgeDays: 500, followers: 1000, following: 200, postsPerDay: 2,
  hasProfilePicture: true, hasBio: true, hasWebsite: true, engagementRate: 3,
  duplicateContentRatio: 0.05, activeHours: 8, repetitiveContentScore: 10, networkScore: 10
};

describe("rule detector", () => {
  it("returns bounded scores", () => {
    const result = detect(base);
    expect(result.riskScore).toBeGreaterThanOrEqual(0);
    expect(result.riskScore).toBeLessThanOrEqual(100);
  });

  it("detects a high-risk synthetic profile", () => {
    const result = detect({
      ...base, accountAgeDays: 5, followers: 5, following: 1500,
      postsPerDay: 80, hasProfilePicture: false, hasBio: false,
      engagementRate: 0.1, duplicateContentRatio: 0.95,
      repetitiveContentScore: 95, networkScore: 90
    });
    expect(["HIGH_RISK", "LIKELY_BOT"]).toContain(result.classification);
  });
});
