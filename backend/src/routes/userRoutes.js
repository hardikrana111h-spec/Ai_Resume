import express from "express";
import { getPlanStatus } from "../controllers/userController.js";
// Tmaru auth token check karva nu middleware (ex: verifyToken, requireAuth, etc.)
import {protect} from "../middleware/authMiddleware.js"; // ADJUST PATH AS NEEDED
const router = express.Router();

// GET /api/user/plan-status
router.get("/plan-status", protect, getPlanStatus); 

export default router;