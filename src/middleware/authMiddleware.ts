import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/* =======================
   Custom Auth Request
======================= */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "admin" | "user";
  };
}

interface JwtPayload {
  id: string;
  role: "admin" | "user";
}

/* =======================
   Protect Middleware
======================= */
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =======================
   Admin Only Middleware
======================= */
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};
