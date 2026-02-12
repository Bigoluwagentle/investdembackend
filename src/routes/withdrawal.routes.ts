import express from "express";
import {
  createWithdrawal,
  getAllWithdrawals,
  getUserWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "../controllers/withdrawalController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createWithdrawal);
router.get("/my", protect, getUserWithdrawals);
router.get("/", protect, admin, getAllWithdrawals);
router.put("/approve/:id", protect, admin, approveWithdrawal);
router.put("/reject/:id", protect, admin, rejectWithdrawal);

export default router;
