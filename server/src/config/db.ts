import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
  if (env.MONGO_DNS_SERVERS) {
    dns.setServers(
      env.MONGO_DNS_SERVERS.split(",")
        .map((server) => server.trim())
        .filter(Boolean),
    );
  }

  await mongoose.connect(env.MONGO_URI);
  console.log("MongoDB connected");
}
