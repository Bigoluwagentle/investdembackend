import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: "user" | "admin";
      email?: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
