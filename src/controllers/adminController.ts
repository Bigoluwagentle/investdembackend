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
      balance,
      coins,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create user" });
  }
};
