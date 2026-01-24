import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    from: { type: String, enum: ["admin", "user"], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
