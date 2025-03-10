import mongoose from "mongoose";
import { UserLogType } from "../constants/userLogTypes";

export interface UserLogDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: UserLogType;
  createdAt: Date;
  message: string;
}

const UserLogSchema = new mongoose.Schema<UserLogDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const UserLogModel = mongoose.model<UserLogDocument>(
  "UserLog",
  UserLogSchema,
  "user_logs"
);

export default UserLogModel;
