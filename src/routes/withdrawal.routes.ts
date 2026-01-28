import express from "express";
import {
  requestWithdrawal,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "../controllers/withdrawal.controller";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, requestWithdrawal);

router.get("/", protect, adminOnly, getAllWithdrawals);
router.patch("/:id/approve", protect, adminOnly, approveWithdrawal);
router.patch("/:id/reject", protect, adminOnly, rejectWithdrawal);

export default router;
