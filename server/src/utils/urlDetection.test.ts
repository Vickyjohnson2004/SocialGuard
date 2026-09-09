import { describe, expect, it } from "vitest";
import { parseSocialAccountUrl } from "./urlDetection";

describe("parseSocialAccountUrl", () => {
  it("detects x.com usernames", () => {
    expect(parseSocialAccountUrl("https://x.com/elonmusk")).toMatchObject({
      platform: "X",
      username: "elonmusk",
    });
  });

  it("detects instagram handles with @", () => {
    expect(parseSocialAccountUrl("instagram.com/@alice")).toMatchObject({
      platform: "Instagram",
      username: "alice",
    });
  });

  it("detects linkedin profile urls", () => {
    expect(
      parseSocialAccountUrl("https://www.linkedin.com/in/jane-doe-12345/"),
    ).toMatchObject({
      platform: "LinkedIn",
      username: "jane-doe-12345",
    });
  });

  it("returns null for unsupported url formats", () => {
    expect(parseSocialAccountUrl("https://example.com/something")).toBeNull();
  });
});
