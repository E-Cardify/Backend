import { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import SessionModel from "../../models/Session.model";
import { OK } from "../../constants/http";
import { clearAuthCookies } from "../../utils/cookies";

export default async function logout(req: Request, res: Response) {
  const accessToken = req.cookies["accessToken"] as string | undefined;
  const { payload } = verifyToken(accessToken || "");

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  clearAuthCookies(res).status(OK).json();
}
