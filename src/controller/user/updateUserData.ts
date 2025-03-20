import { Request, Response } from "express";
import UserModel from "../../models/User.model";
import { BAD_REQUEST, CONFLICT, NOT_FOUND, OK } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { updateUserDataSchema } from "./user.schemas";
import VerificationCodeModel from "../../models/VerificationCode.model";
import VerificationCodeType from "../../constants/verificationCodeTypes";
import { oneYearFromNow } from "../../utils/oneYearFromNow";
import { sendVerificationMail } from "../../services/mail.service";
import mongoose from "mongoose";
import { createUserLog } from "../../services/auth.service";
import { UserLogType } from "../../constants/userLogTypes";
import { formatUserPrivateDataResponse } from "../../utils/responseUtils";
import { hashValue } from "../../utils/bcrypt";

export const updateUserData = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");

  const { firstName, lastName, email, password } = updateUserDataSchema.parse(
    req.body
  );

  if (password) {
    appAssert(
      user.password !== (await hashValue(password)),
      BAD_REQUEST,
      "New password cannot be the same as the old password"
    );

    user.password = password;
    createUserLog(user, UserLogType.PasswordChanged, "Password changed", false);
  }

  if (firstName && firstName !== user.firstName) {
    createUserLog(
      user,
      UserLogType.AccountUpdated,
      `First name update from ${user.firstName} to ${firstName}`,
      false
    );

    user.firstName = firstName;
  }

  if (lastName && lastName !== user.lastName) {
    createUserLog(
      user,
      UserLogType.AccountUpdated,
      `Last name update from ${user.lastName} to ${lastName}`,
      false
    );

    user.lastName = lastName;
  }

  if (email && email !== user.email) {
    const existingUser = await UserModel.findOne({
      email,
    });
    appAssert(!existingUser, CONFLICT, "User with this email already exists");

    createUserLog(
      user,
      UserLogType.AccountUpdated,
      `Email update from ${user.email} to ${email}`,
      false
    );

    user.email = email;
    user.isVerified = false;

    const verificationCode = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationCodeType.EmailVerification,
      expiresAt: oneYearFromNow(),
    });

    // Send verification mail
    // Assure that user is created even if mail couldn't be sent
    try {
      sendVerificationMail(
        user,
        verificationCode._id as mongoose.Types.ObjectId
      );
    } catch (error) {
      console.log("Mail couldn't be sent", error);
    }
  }

  await user.save();

  res.status(OK).json(formatUserPrivateDataResponse(user));
};
