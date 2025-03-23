import { NextFunction, Request, Response } from "express";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import AppErrorCode from "../constants/AppErrorCode";
import { verifyToken } from "../utils/jwt";
import { ProtectedRequest } from "../types/ProtectedRequest";

export const authenticate = async (
  req: Request & ProtectedRequest,
  _: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies["accessToken"] as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;
  next();
};

export const authenticateNonStrict = async (
  req: Request & ProtectedRequest,
  _: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies["accessToken"] as string | undefined;

  if (!accessToken) {
    next();
    return;
  }

  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;
  next();
};
