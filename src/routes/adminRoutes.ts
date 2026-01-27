import express from "express";
import { createUser, assignCoinToUser } from "../controllers/adminController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-user", protect, adminOnly, createUser);
router.post("/assign-coin", protect, adminOnly, assignCoinToUser);

export default router;
