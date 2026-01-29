import { Request, Response } from "express";
import Withdrawal from "../models/Withdrawal";
import User from "../models/User";

/**
 * USER: Create withdrawal request
 */
export const createWithdrawal = async (req: Request, res: Response) => {
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

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal amount" });
    }

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

    return res.status(201).json({
      message: "Withdrawal request submitted",
      withdrawal,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

/**
 * ADMIN: Get all withdrawals
 */
export const getAllWithdrawals = async (_req: Request, res: Response) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("user", "email")
      .sort({ createdAt: -1 });

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * ADMIN: Approve withdrawal
 */
export const approveWithdrawal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    withdrawal.status = "approved";
    withdrawal.reviewedAt = new Date();
    withdrawal.rejectionReason = undefined;

    await withdrawal.save();

    res.json({ message: "Withdrawal approved", withdrawal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * ADMIN: Reject withdrawal
 */
export const rejectWithdrawal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    withdrawal.status = "rejected";
    withdrawal.rejectionReason = reason;
    withdrawal.reviewedAt = new Date();

    await withdrawal.save();

    res.json({ message: "Withdrawal rejected", withdrawal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
