import express from "express";
import { createUser, getAllUsers } from "../controllers/adminController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-user", protect, adminOnly, createUser);
router.get("/users", protect, adminOnly, getAllUsers);

export default router;
