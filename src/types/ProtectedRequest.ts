import mongoose from "mongoose";

export {};

declare global {
  namespace Express {
    export interface Request {
      userId: mongoose.Types.ObjectId;
      sessionId: mongoose.Types.ObjectId;
    }
  }
}

export interface ProtectedRequest {
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
}
