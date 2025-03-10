import { Request, Response } from "express";
import { verificationCodeSchema } from "./auth.schemas";
import {
  createUserLog,
  verifyEmail as verifyEmailService,
} from "../../services/auth.service";
import { formatUserPrivateDataResponse } from "../../utils/responseUtils";
import { OK } from "../../constants/http";
import { UserLogType } from "../../constants/userLogTypes";

const verifyEmail = async (req: Request, res: Response) => {
  const verificationCode = verificationCodeSchema.parse(req.params["code"]);

  const { user } = await verifyEmailService(verificationCode);

  res.status(OK).json(formatUserPrivateDataResponse(user));

  createUserLog(user, UserLogType.EmailVerified, "Email verified");
};

export default verifyEmail;
