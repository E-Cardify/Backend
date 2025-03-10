import { Request, Response } from "express";
import { OK, UNAUTHORIZED } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import {
  createUserLog,
  refreshUserAccessToken,
} from "../../services/auth.service";
import { setAuthCookies } from "../../utils/cookies";
import { UserLogType } from "../../constants/userLogTypes";
import { formatUserPrivateDataResponse } from "../../utils/responseUtils";

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"] as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  const { accessToken, newRefreshToken, user } = await refreshUserAccessToken(
    refreshToken
  );

  setAuthCookies({ res, accessToken, refreshToken: newRefreshToken })
    .status(OK)
    .json(formatUserPrivateDataResponse(user));

  await createUserLog(user, UserLogType.RefreshToken, "Refresh token");
};

export default refresh;
