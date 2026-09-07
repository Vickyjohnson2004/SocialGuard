import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import authRoutes from "./routes/auth";
import analysisRoutes from "./routes/analysis";
import accountRoutes from "./routes/accounts";
import analyticsRoutes from "./routes/analytics";
import investigationRoutes from "./routes/investigations";
import notificationRoutes from "./routes/notifications";
import datasetRoutes from "./routes/datasets";
import { errorHandler } from "./middleware/error";
import { connectDB } from "./config/db";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});
app.use(
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true }),
);
app.get("/api/v1/health", (_req, res) =>
  res.json({ success: true, message: "SocialGuard API is healthy" }),
);
app.get("/", (_req, res) =>
  res.json({
    success: true,
    message: "SocialGuard API is healthy and Working",
  }),
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/analysis", analysisRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/investigations", investigationRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/datasets", datasetRoutes);

app.use(errorHandler);

export default app;
