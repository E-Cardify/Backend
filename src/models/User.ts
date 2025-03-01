import { InferSchemaType, Schema, Types, model } from "mongoose";

const userUpdateLogSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    auto: true,
  },
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
});

const UserSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      auto: true,
    },
    accountUpdateLogs: {
      type: [userUpdateLogSchema],
      default: [],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    cards: {
      type: [Types.ObjectId],
      ref: "CardInfo",
      default: [],
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    mainCard: {
      type: Types.ObjectId,
      ref: "CardInfo",
      default: null,
    },
    maxCards: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

export type UserUpdateLogType = InferSchemaType<typeof userUpdateLogSchema>;
export type UserType = InferSchemaType<typeof UserSchema>;

const User = model<UserType>("User", UserSchema);
export default User;
