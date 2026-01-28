import { Types } from "mongoose";

declare global {
  namespace Express {
    interface UserPayload {
      id: Types.ObjectId | string;
      role: "admin" | "user";
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
