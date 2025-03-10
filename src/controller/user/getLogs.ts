import { Request, Response } from "express";
import { ProtectedRequest } from "../../types/ProtectedRequest";
import appAssert from "../../utils/appAssert";
import { NOT_FOUND } from "../../constants/http";
import UserModel from "../../models/User.model";
import { getLogsSchema } from "./user.schemas";

export const getLogs = async (
  req: Request & ProtectedRequest,
  res: Response
) => {
  const user = await UserModel.findById(req.userId).populate("userLogs");
  appAssert(user, NOT_FOUND, "User not found");

  const { limit, offset, type } = getLogsSchema.parse(req.body);

  const logs = await user.getLogs({
    limit,
    offset,
    type,
  });

  res.status(200).json(logs);
};
