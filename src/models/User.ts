import mongoose from "mongoose";

const coinSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  amount: { type: Number, required: true },
  valueUsd: { type: Number, required: true },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    balance: { type: Number, default: 0 },
    coins: { type: [coinSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
