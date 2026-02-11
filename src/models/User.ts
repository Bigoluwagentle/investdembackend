import mongoose, { Schema, Document } from "mongoose";

/* ===== Coin subdocument ===== */
export interface ICoin {
  name: string;
  symbol: string;
  amount: number;
  valueUsd: number;
}

/* ===== User ===== */
export interface IUser extends Document {
  email: string;
  password: string;
  role: "admin" | "user";
  balance: number;
  coins: ICoin[];
}

const CoinSchema = new Schema<ICoin>(
  {
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    amount: { type: Number, required: true },
    valueUsd: { type: Number, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    balance: { type: Number, default: 0 },
    coins: { type: [CoinSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
