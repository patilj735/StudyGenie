import express from "express";
import {
  uploadFile,
  getAllFiles,
  getFileById,
} from "../controllers/file.controller.js";

import { protectRoute, isTeacher } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();


router.get("/files", protectRoute, getAllFiles);
router.get("/files/:id", protectRoute, getFileById);
// router.get("/files/:id/summary", protectRoute, getFileSummary);
// router.get("/files/:id/quiz", protectRoute, getFileQuiz);
router.post("/files", protectRoute, isTeacher, upload.single("file"), uploadFile);

export default router;
