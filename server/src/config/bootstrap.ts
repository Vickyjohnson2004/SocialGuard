import bcrypt from "bcryptjs";
import { User } from "../models/User";

const demoUsers = [
  {
    email: "admin@socialguard.local",
    name: "System Admin",
    password: "Admin123!",
    role: "ADMIN" as const,
  },
  {
    email: "user@socialguard.local",
    name: "Random User",
    password: "User123!",
    role: "USER" as const,
  },
];

export async function ensureDemoUsers() {
  for (const user of demoUsers) {
    const email = user.email.toLowerCase();
    const passwordHash = await bcrypt.hash(user.password, 12);

    await User.updateOne(
      { email },
      {
        $set: {
          email,
          name: user.name,
          passwordHash,
          role: user.role,
          verified: true,
        },
      },
      { upsert: true },
    );
  }
}
