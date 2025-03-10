import { Request, Response } from "express";
import { ProtectedRequest } from "../../types/ProtectedRequest";
import appAssert from "../../utils/appAssert";
import UserModel from "../../models/User.model";
import { NOT_FOUND, OK } from "../../constants/http";

export const getCards = async (
  req: Request & ProtectedRequest,
  res: Response
) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");

  const cards = await user.getCards();

  res.status(OK).json(cards);
};
