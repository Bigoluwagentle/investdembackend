import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

interface JwtPayload {
  id: string;
  role: "admin" | "user";
}

export function protect(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalid" });
  }
}

export function adminOnly(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}
