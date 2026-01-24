import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    balance: { type: Number, default: 0 },
    coins: [
      {
        name: String,
        symbol: String,
        amount: Number,
        valueUsd: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
