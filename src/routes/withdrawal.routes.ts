import { Router } from "express";
import {
  createWithdrawal,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "../controllers/withdrawalController";

import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createWithdrawal);

router.get("/", protect, adminOnly, getAllWithdrawals);

router.patch("/:id/approve", protect, adminOnly, approveWithdrawal);

router.patch("/:id/reject", protect, adminOnly, rejectWithdrawal);

export default router;
