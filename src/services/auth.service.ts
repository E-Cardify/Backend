import VerificationCodeType from "../constants/verificationCodeTypes";
import SessionModel from "../models/Session.model";
import { oneYearFromNow } from "../utils/oneYearFromNow";
import appAssert from "../utils/appAssert";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../constants/http";
import UserModel, { UserDocument } from "../models/User.model";
import VerificationCodeModel from "../models/VerificationCode.model";
import { UserLogType } from "../constants/userLogTypes";
import UserLogModel, { UserLogDocument } from "../models/UserLog.model";
import mongoose from "mongoose";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";
import { thirtyDaysFromNow } from "../utils/thirtyDaysFromNow";
import { sendVerificationMail } from "./mail.service";

export type CreateAccountParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userAgent?: string | undefined;
};

export const createAccount = async (data: CreateAccountParams) => {
  const existingUser = await UserModel.exists({
    email: data.email,
  });

  appAssert(!existingUser, CONFLICT, "Email already in use");

  const user = await UserModel.create({
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
  });
  const userId = user._id;

  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // Send verification mail
  // Assure that user is created even if mail couldn't be sent
  try {
    sendVerificationMail(user, verificationCode._id as mongoose.Types.ObjectId);
  } catch (error) {
    console.log("Mail couldn't be sent", error);
  }

  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent,
  });
  const sessionId = session._id;

  const refreshToken = signToken(
    {
      sessionId,
    },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    sessionId,
    userId: userId as mongoose.Types.ObjectId,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export type LoginUserParams = {
  email: string;
  password: string;
  userAgent?: string | undefined;
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginUserParams) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");
  const userId = user._id;

  const isPasswordValid = await user.comparePassword(password);
  appAssert(isPasswordValid, UNAUTHORIZED, "Invalid email or password");

  const session = await SessionModel.create({
    userId,
    userAgent: userAgent,
  });
  const sessionId = session._id;

  const sessionInfo = {
    sessionId,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId: userId as mongoose.Types.ObjectId,
  });

  return { user, accessToken, refreshToken };
};

export const createUserLog = async (
  user: UserDocument,
  type: UserLogType,
  message: string,
  save: boolean = true
) => {
  const userLog: UserLogDocument = await UserLogModel.create({
    userId: user._id,
    type,
    message,
  });

  user.userLogs.push(userLog._id as mongoose.Types.ObjectId);

  if (save) {
    await user.save();
  }
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  const user = await UserModel.findById(session.userId);
  appAssert(user, NOT_FOUND, "User not found");

  session.expiresAt = thirtyDaysFromNow();
  await session.save();

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  const newRefreshToken = signToken(
    {
      sessionId: session._id,
    },
    refreshTokenSignOptions
  );

  return {
    accessToken,
    newRefreshToken: newRefreshToken,
    user,
  };
};

export const verifyEmail = async (code: string) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });

  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      isVerified: true,
    },
    {
      new: true,
    }
  );

  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

  await VerificationCodeModel.findByIdAndDelete(validCode._id);

  return { user: updatedUser };
};
