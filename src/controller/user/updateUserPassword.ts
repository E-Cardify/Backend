import { Request, Response } from "express";
import UserModel from "../../models/User.model";
import appAssert from "../../utils/appAssert";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "../../constants/http";
import { ResetPasswordSchema } from "../auth/auth.schemas";
import { createUserLog } from "../../services/auth.service";
import { UserLogType } from "../../constants/userLogTypes";

export const updateUserPassword = async (req: Request, res: Response) => {
  const { newPassword, password } = ResetPasswordSchema.parse(req.body);
  appAssert(
    newPassword !== password,
    BAD_REQUEST,
    "New password cannot be the same as the old password"
  );

  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");

  const isPasswordCorrect = await user.comparePassword(password);
  appAssert(isPasswordCorrect, UNAUTHORIZED, "Old password is incorrect");

  user.password = newPassword;
  createUserLog(user, UserLogType.PasswordChanged, "Password changed", false);

  await user.save();

  res.status(OK).json({ message: "Password updated successfully" });
};
