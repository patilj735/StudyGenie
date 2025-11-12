import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  generateFileSummary,
  generateFileQuiz,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.get("/:id/summary", protectRoute, generateFileSummary);
router.get("/:id/quiz", protectRoute, generateFileQuiz);

export default router;
