import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { submitContact } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", protect, submitContact);

export default router;