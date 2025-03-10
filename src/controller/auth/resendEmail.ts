import { Request, Response } from "express";
import VerificationCodeModel from "../../models/VerificationCode.model";
import { ProtectedRequest } from "../../types/ProtectedRequest";
import UserModel from "../../models/User.model";
import { CONFLICT, NOT_FOUND, OK } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import VerificationCodeType from "../../constants/verificationCodeTypes";
import { oneYearFromNow } from "../../utils/oneYearFromNow";
import { sendVerificationMail } from "../../services/mail.service";
import mongoose from "mongoose";
import { createUserLog } from "../../services/auth.service";
import { UserLogType } from "../../constants/userLogTypes";
import { fiveMinutesAgo } from "../../utils/fiveMinutesAgo";

const resendEmail = async (req: Request & ProtectedRequest, res: Response) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  appAssert(!user.isVerified, CONFLICT, "User is already verified");
  const userId = user._id;

  const fiveMinAgo = fiveMinutesAgo();
  const count = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    createdAt: { $gt: fiveMinAgo },
  });

  appAssert(count < 3, CONFLICT, "You have sent too many verification emails");

  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  sendVerificationMail(user, verificationCode._id as mongoose.Types.ObjectId);
  createUserLog(user, UserLogType.EmailSent, "Email verification resent");
  await user.save();

  res.status(OK).json({ message: "Email sent" });
};

export default resendEmail;
