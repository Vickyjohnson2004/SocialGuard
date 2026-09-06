import { Router } from "express";
import { auth } from "../middleware/auth";
import { notifications } from "../controllers/notifications";

const router = Router();
router.use(auth);
router.get("/", notifications);
export default router;
