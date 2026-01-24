import express from "express";
import { protect } from "../middleware/authMiddleware";
import User from "../models/User";

const router = express.Router();

router.get("/me", protect, async (req: any, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

export default router;
