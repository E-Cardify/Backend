import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/thirtyDaysFromNow";

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
  userAgent?: string;
}

const SessionSchema = new mongoose.Schema<SessionDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: thirtyDaysFromNow,
      required: true,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SessionModel = mongoose.model<SessionDocument>("Session", SessionSchema);

export default SessionModel;
