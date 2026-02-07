import { Request, Response } from "express";
import Withdrawal from "../models/Withdrawal";
import User from "../models/User";

export const createWithdrawal = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { amount, ...bankDetails } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  const withdrawal = await Withdrawal.create({
    user: userId,
    amount,
    ...bankDetails,
  });

  res.status(201).json(withdrawal);
};

/* ================= ADMIN ================= */
export const getAllWithdrawals = async (_req: Request, res: Response) => {
  const withdrawals = await Withdrawal.find().populate("user", "email");
  res.json(withdrawals);
};

export const approveWithdrawal = async (req: Request, res: Response) => {
  const withdrawal = await Withdrawal.findById(req.params.id);
  if (!withdrawal) return res.status(404).json({ message: "Not found" });

  if (withdrawal.status !== "pending") {
    return res.status(400).json({ message: "Already processed" });
  }

  const user = await User.findById(withdrawal.user);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.balance < withdrawal.amount) {
    return res.status(400).json({ message: "User balance insufficient" });
  }

  user.balance -= withdrawal.amount;
  await user.save();

  withdrawal.status = "approved";
  withdrawal.reviewedAt = new Date();
  await withdrawal.save();

  res.json({ message: "Withdrawal approved" });
};

export const rejectWithdrawal = async (req: Request, res: Response) => {
  const { reason } = req.body;

  const withdrawal = await Withdrawal.findById(req.params.id);
  if (!withdrawal) return res.status(404).json({ message: "Not found" });

  withdrawal.status = "rejected";
  withdrawal.rejectionReason = reason;
  withdrawal.reviewedAt = new Date();

  await withdrawal.save();

  res.json({ message: "Withdrawal rejected" });
};
