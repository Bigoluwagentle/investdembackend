import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, balance, coins } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: "user",
      balance: balance || 0,
      coins: coins || [],
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const assignCoinToUser = async (req: Request, res: Response) => {
  try {
    const { userId, name, symbol, amount, valueUsd } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingCoin = user.coins.find(
      (coin: any) => coin.symbol === symbol
    );

    if (existingCoin) {
      existingCoin.amount = amount;
      existingCoin.valueUsd = valueUsd;
    } else {
      user.coins.push({ name, symbol, amount, valueUsd });
    }

    await user.save();

    res.json({
      message: "Coin assigned successfully",
      coins: user.coins,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign coin" });
  }
};
