import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAnalysis, listAnalyses, getAnalysis, reanalyze } from "../controllers/analysis";

const router = Router();
router.use(auth);
router.post("/", createAnalysis);
router.get("/", listAnalyses);
router.get("/:id", getAnalysis);
router.post("/:id/reanalyze", reanalyze);
export default router;
