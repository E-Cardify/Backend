import { Request, Response } from "express";
import { formatUserPrivateDataResponse } from "../../utils/responseUtils";
import { LoginSchema } from "./auth.schemas";
import { createUserLog, loginUser } from "../../services/auth.service";
import { setAuthCookies } from "../../utils/cookies";
import { OK } from "../../constants/http";
import { UserLogType } from "../../constants/userLogTypes";
/**
 * Handles user login by validating credentials and generating authentication tokens.
 */
const login = async (req: Request, res: Response) => {
  const request = LoginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { email, password, userAgent } = request;

  const { accessToken, refreshToken, user } = await loginUser({
    email,
    password,
    userAgent,
  });

  setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json(formatUserPrivateDataResponse(user));

  createUserLog(user, UserLogType.UserLoggedIn, "User logged in");
};

export default login;
