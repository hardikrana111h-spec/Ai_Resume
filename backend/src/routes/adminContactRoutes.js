import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { admin } from "../middleware/adminMiddleware.js";

import {
  getAllContacts,
  getContactById,
  replyContact,
  toggleImportant,
  deleteContact,
} from "../controllers/adminContactController.js";

const router =
  express.Router();

router.use(protect);
router.use(admin);

router.get(
  "/",
  getAllContacts
);

router.get(
  "/:id",
  getContactById
);

router.post(
  "/:id/reply",
  replyContact
);

router.patch(
  "/:id/important",
  toggleImportant
);

router.delete(
  "/:id",
  deleteContact
);

export default router;