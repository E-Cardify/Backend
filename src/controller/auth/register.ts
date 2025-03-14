import { Request, Response } from "express";
import { createAccount, createUserLog } from "../../services/auth.service";
import { CREATED, FORBIDDEN } from "../../constants/http";
import { setAuthCookies } from "../../utils/cookies";
import { UserLogType } from "../../constants/userLogTypes";
import { registerSchema } from "./auth.schemas";
import { formatUserPrivateDataResponse } from "../../utils/responseUtils";
import appAssert from "../../utils/appAssert";

/**
 * Handles user registration by creating a new user account.
 */
const register = async (req: Request, res: Response) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { privacyPolicy } = request;

  appAssert(privacyPolicy, FORBIDDEN, "You must accept privacy policy");

  const { user, accessToken, refreshToken } = await createAccount(request);

  setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(formatUserPrivateDataResponse(user));

  createUserLog(user, UserLogType.AccountCreated, "Account created");
};

export default register;
