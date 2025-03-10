import { Request, Response } from "express";
import { ProtectedRequest } from "../../types/ProtectedRequest";
import UserModel from "../../models/User.model";
import { NOT_FOUND, OK } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { formatUserPrivateDataResponse } from "../../utils/responseUtils";

export const getUserPrivateData = async (
  req: Request & ProtectedRequest,
  res: Response
) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  res.status(OK).json(formatUserPrivateDataResponse(user));
  return;
};
