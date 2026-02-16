import mongoose, { Document, Schema } from "mongoose";

export interface IWithdrawal extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawal>(
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
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IWithdrawal>(
  "Withdrawal",
  withdrawalSchema
);
