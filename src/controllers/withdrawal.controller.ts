import { Request, Response } from "express";
import Withdrawal from "../models/Withdrawal";
import User from "../models/User";

/**
 * USER: Request withdrawal
 */
export const requestWithdrawal = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const {
      amount,
      bankName,
      accountName,
      accountNumber,
      accountType,
      country,
      bankCode,
      narration,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (amount > user.balance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const withdrawal = await Withdrawal.create({
      user: userId,
      amount,
      bankName,
      accountName,
      accountNumber,
      accountType,
      country,
      bankCode,
      narration,
    });

    res.status(201).json({
      message: "Withdrawal request submitted",
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to request withdrawal" });
  }
};

/**
 * ADMIN: Get all withdrawals
 */
export const getAllWithdrawals = async (_req: Request, res: Response) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("user", "email balance")
      .sort({ createdAt: -1 });

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch withdrawals" });
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

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    const user = await User.findById(withdrawal.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (withdrawal.amount > user.balance) {
      return res.status(400).json({ message: "User balance insufficient" });
    }

    user.balance -= withdrawal.amount;
    await user.save();

    withdrawal.status = "approved";
    await withdrawal.save();

    res.json({ message: "Withdrawal approved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve withdrawal" });
  }
};

/**
 * ADMIN: Reject withdrawal (REASON REQUIRED)
 */
export const rejectWithdrawal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    withdrawal.status = "rejected";
    withdrawal.rejectionReason = reason;
    await withdrawal.save();

    res.json({ message: "Withdrawal rejected with reason" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject withdrawal" });
  }
};
