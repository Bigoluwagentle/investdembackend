import express from "express";
import { createUser } from "../controllers/adminController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-user", protect, adminOnly, createUser);

export default router;
