import express from "express";
import {
  analyzeResume,
  getReports,
  getReportById,
  deleteReport,
} from "../controllers/resumeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  analyzeResume
);

router.get("/history", protect, getReports);

router.get("/:id", protect, getReportById);

router.delete("/:id", protect, deleteReport);

export default router;