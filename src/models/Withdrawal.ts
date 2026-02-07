import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWithdrawal extends Document {
  user: Types.ObjectId;
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
  reviewedAt?: Date;
}

const WithdrawalSchema = new Schema<IWithdrawal>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },

    bankName: String,
    accountName: String,
    accountNumber: String,
    accountType: String,
    bankCode: String,
    country: String,
    narration: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: String,
    reviewedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IWithdrawal>("Withdrawal", WithdrawalSchema);
