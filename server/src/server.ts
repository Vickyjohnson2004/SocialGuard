import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { ensureDemoUsers } from "./config/bootstrap";

connectDB()
  .then(async () => {
    await ensureDemoUsers();
    app.listen(env.PORT, () =>
      console.log(`SocialGuard API running on port ${env.PORT}`),
    );
  })
  .catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
  });
