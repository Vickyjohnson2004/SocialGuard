import bcrypt from "bcryptjs";
import { connectDB } from "./config/db";
import { User } from "./models/User";
import { SocialAccount } from "./models/SocialAccount";
import { Analysis } from "./models/Analysis";
import { detect } from "./detection/rules";

async function seed() {
  await connectDB();
  await User.deleteMany({});
  await SocialAccount.deleteMany({});
  await Analysis.deleteMany({});

  const users = await User.insertMany([
    { name: "System Admin", email: "admin@socialguard.local", passwordHash: await bcrypt.hash("Admin123!", 12), role: "ADMIN" },
    { name: "Research User", email: "researcher@socialguard.local", passwordHash: await bcrypt.hash("Researcher123!", 12), role: "RESEARCHER" },
    { name: "Content Moderator", email: "moderator@socialguard.local", passwordHash: await bcrypt.hash("Moderator123!", 12), role: "MODERATOR" }
  ]);

  const researcher = users[1];
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
    createdBy: researcher._id
  }));

  for (const record of records) {
    const account = await SocialAccount.create(record);
    await Analysis.create({ accountId: account._id, userId: researcher._id, ...detect(account) });
  }

  console.log("Seed complete.");
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
