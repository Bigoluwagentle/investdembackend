import { Request, Response } from "express";
import Withdrawal from "../models/Withdrawal";
import User from "../models/User";

export const createWithdrawal = async (req: any, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const withdrawal = await Withdrawal.create({
      user: user._id,
      amount,
      status: "pending",
    });

    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserWithdrawals = async (req: any, res: Response) => {
  try {
    const withdrawals = await Withdrawal.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllWithdrawals = async (req: Request, res: Response) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("user", "email balance")
      .sort({ createdAt: -1 });

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const approveWithdrawal = async (
  req: Request,
  res: Response
) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    const user = await User.findById(withdrawal.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.balance < withdrawal.amount) {
      return res
        .status(400)
        .json({ message: "User has insufficient balance" });
    }

    user.balance -= withdrawal.amount;
    await user.save();

    withdrawal.status = "approved";
    await withdrawal.save();

    res.json({ message: "Withdrawal approved" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const rejectWithdrawal = async (
  req: Request,
  res: Response
) => {
  try {
    const { reason } = req.body;

    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    withdrawal.status = "rejected";
    withdrawal.rejectionReason = reason || "No reason provided";

    await withdrawal.save();

    res.json({ message: "Withdrawal rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
