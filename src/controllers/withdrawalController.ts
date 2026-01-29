import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Withdrawal from "../models/Withdrawal";
import User from "../models/User";

// User creates withdrawal
export const createWithdrawal = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const {
      amount,
      bankName,
      accountName,
      accountNumber,
      accountType,
      bankCode,
      country,
      narration,
    } = req.body;

    const withdrawal = await Withdrawal.create({
      user: userId,
      amount,
      bankName,
      accountName,
      accountNumber,
      accountType,
      bankCode,
      country,
      narration,
      status: "pending",
    });

    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: "Failed to create withdrawal" });
  }
};

// Admin: get all withdrawals
export const getAllWithdrawals = async (
  req: AuthRequest,
  res: Response
) => {
  const withdrawals = await Withdrawal.find().populate("user", "email");
  res.json(withdrawals);
};

// Admin approves withdrawal
export const approveWithdrawal = async (
  req: AuthRequest,
  res: Response
) => {
  const withdrawal = await Withdrawal.findById(req.params.id);

  if (!withdrawal) {
    return res.status(404).json({ message: "Withdrawal not found" });
  }

  withdrawal.status = "approved";
  withdrawal.reviewedAt = new Date();
  await withdrawal.save();

  res.json({ message: "Withdrawal approved" });
};

// Admin rejects withdrawal
export const rejectWithdrawal = async (
  req: AuthRequest,
  res: Response
) => {
  const { reason } = req.body;

  const withdrawal = await Withdrawal.findById(req.params.id);

  if (!withdrawal) {
    return res.status(404).json({ message: "Withdrawal not found" });
  }

  withdrawal.status = "rejected";
  withdrawal.rejectionReason = reason;
  withdrawal.reviewedAt = new Date();
  await withdrawal.save();

  res.json({ message: "Withdrawal rejected" });
};
