import { Router } from "express";
import { register, login, refresh, logout, me } from "../controllers/auth";
import { auth } from "../middleware/auth";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", auth, me);
export default router;
