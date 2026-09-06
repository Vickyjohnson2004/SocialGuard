import { Router } from "express";
import { auth, roles } from "../middleware/auth";
import { listInvestigations, createInvestigation, updateInvestigation } from "../controllers/investigations";

const router = Router();
router.use(auth);
router.get("/", listInvestigations);
router.post("/", createInvestigation);
router.patch("/:id", roles("ADMIN", "MODERATOR", "RESEARCHER"), updateInvestigation);
export default router;
