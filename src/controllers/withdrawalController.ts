import { Request, Response } from "express";
import Withdrawal from "../models/Withdrawal";
import User from "../models/User";

/* ===== CREATE WITHDRAWAL (USER) ===== */
export const createWithdrawal = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

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

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (amount > user.balance)
      return res.status(400).json({ message: "Insufficient balance" });

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
    });

    res.status(201).json(withdrawal);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===== GET ALL WITHDRAWALS (ADMIN) ===== */
export const getAllWithdrawals = async (
  req: Request,
  res: Response
) => {
  const withdrawals = await Withdrawal.find()
    .populate("user", "email")
    .sort({ createdAt: -1 });

  res.json(withdrawals);
};

/* ===== GET USER WITHDRAWALS ===== */
export const getUserWithdrawals = async (
  req: Request,
  res: Response
) => {
  const userId = (req as any).user.id;

  const withdrawals = await Withdrawal.find({ user: userId })
    .sort({ createdAt: -1 });

  res.json(withdrawals);
};

/* ===== APPROVE (ADMIN) ===== */
export const approveWithdrawal = async (
  req: Request,
  res: Response
) => {
  const withdrawal = await Withdrawal.findById(req.params.id);

  if (!withdrawal)
    return res.status(404).json({ message: "Not found" });

  if (withdrawal.status !== "pending")
    return res.status(400).json({ message: "Already processed" });

  const user = await User.findById(withdrawal.user);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.balance -= withdrawal.amount;
  await user.save();

  withdrawal.status = "approved";
  await withdrawal.save();

  res.json({ message: "Withdrawal approved" });
};

/* ===== REJECT (ADMIN) ===== */
export const rejectWithdrawal = async (
  req: Request,
  res: Response
) => {
  const { reason } = req.body;

  const withdrawal = await Withdrawal.findById(req.params.id);

  if (!withdrawal)
    return res.status(404).json({ message: "Not found" });

  withdrawal.status = "rejected";
  withdrawal.rejectionReason = reason;
  await withdrawal.save();

  res.json({ message: "Withdrawal rejected" });
};
