import mongoose, { Schema, Document } from "mongoose";

export interface IWithdrawal extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  bankCode: string;
  country: string;
  narration?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

const WithdrawalSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    bankName: { type: String, required: true },
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountType: { type: String, required: true },
    bankCode: { type: String, required: true },
    country: { type: String, required: true },
    narration: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IWithdrawal>(
  "Withdrawal",
  WithdrawalSchema
);
