import mongoose, { Schema, Types } from "mongoose";

export type WithdrawalStatus = "pending" | "approved" | "rejected";

export interface WithdrawalDocument extends mongoose.Document {
  user: Types.ObjectId;
  amount: number;

  bankName: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  bankCode: string;
  country: string;

  status: WithdrawalStatus;
  narration?: string;
  rejectionReason?: string;

  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalSchema = new Schema<WithdrawalDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    bankName: {
      type: String,
      required: true,
    },

    accountName: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    accountType: {
      type: String,
      required: true,
    },

    bankCode: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    narration: {
      type: String,
    },

    rejectionReason: {
      type: String,
    },

    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Withdrawal = mongoose.model<WithdrawalDocument>(
  "Withdrawal",
  WithdrawalSchema
);

export default Withdrawal;
