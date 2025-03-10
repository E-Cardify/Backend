import { Request, Response } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { ProtectedRequest } from "../../types/ProtectedRequest";
import UserModel from "../../models/User.model";
import { BAD_REQUEST, NOT_FOUND, OK } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import CardInfoModel from "../../models/CardInfo.model";
import { createUserLog } from "../../services/auth.service";
import { UserLogType } from "../../constants/userLogTypes";

export const updateMainCard = async (
  req: Request & ProtectedRequest,
  res: Response
) => {
  const { id } = req.params;
  appAssert(isValidObjectId(id), BAD_REQUEST, "Invalid card id");

  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  const userId = user._id as mongoose.Types.ObjectId;

  appAssert(
    user.cards.length !== 0,
    BAD_REQUEST,
    "User doesn't have any cards"
  );

  appAssert(
    !(user.mainCard as mongoose.Types.ObjectId).equals(id),
    BAD_REQUEST,
    "Main card is already set to this card"
  );

  const card = await CardInfoModel.findOne({
    _id: id,
    userId,
  });
  appAssert(card, NOT_FOUND, "Card not found");

  createUserLog(
    user,
    UserLogType.MainCardSet,
    "Main card from " + user.mainCard + " set to " + card._id,
    false
  );

  user.mainCard = card._id as mongoose.Types.ObjectId;

  await user.save();

  res.status(OK).json(card);
};
