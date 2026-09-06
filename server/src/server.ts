import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

connectDB()
  .then(() => app.listen(env.PORT, () => console.log(`SocialGuard API running on port ${env.PORT}`)))
  .catch(err => {
    console.error("Startup failed:", err);
    process.exit(1);
  });
