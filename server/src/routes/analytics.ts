import { Router } from "express";
import { auth } from "../middleware/auth";
import { dashboardAnalytics } from "../controllers/analytics";

const router = Router();
router.use(auth);
router.get("/dashboard", dashboardAnalytics);
export default router;
