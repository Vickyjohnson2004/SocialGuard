import bcrypt from "bcryptjs";
import { connectDB } from "./config/db";
import { User } from "./models/User";
import { SocialAccount } from "./models/SocialAccount";
import { Analysis } from "./models/Analysis";
import { Investigation } from "./models/Investigation";
import { Notification } from "./models/Notification";
import { detect } from "./detection/rules";

async function seed() {
  await connectDB();
  await User.deleteMany({});
  await SocialAccount.deleteMany({});
  await Analysis.deleteMany({});
  await Investigation.deleteMany({});
  await Notification.deleteMany({});

  const users = await User.insertMany([
    {
      name: "System Admin",
      email: "admin@socialguard.local",
      passwordHash: await bcrypt.hash("Admin123!", 12),
      role: "ADMIN",
    },
    {
      name: "Random User",
      email: "user@socialguard.local",
      passwordHash: await bcrypt.hash("User123!", 12),
      role: "USER",
    },
  ]);

  const userAccount = users[1];
  const records = Array.from({ length: 25 }, (_, i) => ({
    platform: ["X", "Instagram", "Facebook", "TikTok"][i % 4],
    username: `synthetic_user_${i + 1}`,
    followers: i % 3 === 0 ? 10 + i : 500 + i * 30,
    following: i % 3 === 0 ? 900 + i * 10 : 300 + i,
    posts: 50 + i * 40,
    accountAgeDays: i % 4 === 0 ? 10 + i : 400 + i * 20,
    hasProfilePicture: i % 5 !== 0,
    hasBio: i % 4 !== 0,
    hasWebsite: i % 3 === 0,
    isVerified: i % 10 === 0,
    averageLikes: 10 + i * 2,
    averageComments: 1 + i,
    averageShares: i,
    postsPerDay: i % 3 === 0 ? 25 + i : 2 + (i % 5),
    engagementRate: i % 3 === 0 ? 0.2 : 2.5,
    duplicateContentRatio: i % 3 === 0 ? 0.8 : 0.05,
    activeHours: i % 5 === 0 ? 22 : 8,
    repetitiveContentScore: i % 3 === 0 ? 85 : 15,
    networkScore: i % 4 === 0 ? 75 : 20,
    createdBy: userAccount._id,
  }));

  const riskAccounts = [];
  for (const record of records) {
    const account = await SocialAccount.create(record);
    const result = detect(account);
    const analysis = await Analysis.create({
      accountId: account._id,
      userId: userAccount._id,
      ...result,
    });
    if (analysis.riskScore >= 60) {
      riskAccounts.push({ account, analysis });
    }
  }

  await Investigation.insertMany(
    riskAccounts.slice(0, 5).map(({ account, analysis }) => ({
      accountId: account._id,
      analysisId: analysis._id,
      createdBy: userAccount._id,
      status: analysis.riskScore >= 80 ? "OPEN" : "UNDER_REVIEW",
      notes: [
        {
          text: "Seeded review: examine the account signals before making a moderation decision.",
          authorId: userAccount._id,
          createdAt: new Date(),
        },
      ],
    })),
  );

  await Notification.insertMany(
    riskAccounts.slice(0, 8).map(({ account, analysis }) => ({
      userId: userAccount._id,
      title: `${analysis.classification.replace("_", " ")} account detected`,
      message: `@${account.username} on ${account.platform} has a risk score of ${analysis.riskScore}/100.`,
      read: false,
    })),
  );

  console.log(
    `Seed complete: ${users.length} users, ${records.length} accounts, ${riskAccounts.length} flagged accounts.`,
  );
  process.exit(0);
}
seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
