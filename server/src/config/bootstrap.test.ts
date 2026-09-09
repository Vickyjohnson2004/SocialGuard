import { beforeEach, describe, expect, it } from "vitest";
import { connectDB } from "./db";
import { User } from "../models/User";
import { ensureDemoUsers } from "./bootstrap";

describe("ensureDemoUsers", () => {
  beforeEach(async () => {
    await connectDB();
    await User.deleteMany({
      email: { $in: ["admin@socialguard.local", "user@socialguard.local"] },
    });
  });

  it("creates the local demo accounts when they are missing", async () => {
    await ensureDemoUsers();

    const admin = await User.findOne({ email: "admin@socialguard.local" });
    const user = await User.findOne({ email: "user@socialguard.local" });

    expect(admin).toBeTruthy();
    expect(admin?.role).toBe("ADMIN");
    expect(user).toBeTruthy();
    expect(user?.role).toBe("USER");
  });
});
