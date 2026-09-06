import { Router } from "express";
import { auth } from "../middleware/auth";
import { listAccounts, getAccount } from "../controllers/accounts";

const router = Router();
router.use(auth);
router.get("/", listAccounts);
router.get("/:id", getAccount);
export default router;
