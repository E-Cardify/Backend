import { InferSchemaType, Schema, Types, model } from "mongoose";

const UserSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      auto: true,
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
  },
  {
    timestamps: true,
  }
);

export type UserType = InferSchemaType<typeof UserSchema>;

const User = model<UserType>("User", UserSchema);
export default User;
