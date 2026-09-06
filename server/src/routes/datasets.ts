import { Router } from "express";
import multer from "multer";
import { auth } from "../middleware/auth";
import { uploadDataset } from "../controllers/datasets";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
router.post("/upload", auth, upload.single("file"), uploadDataset);
export default router;
