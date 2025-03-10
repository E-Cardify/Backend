import { Request, Response } from "express";
import CardInfo from "../../models/CardInfo.model";
import { ProtectedRequest } from "../../types/ProtectedRequest";
import UserModel from "../../models/User.model";
import appAssert from "../../utils/appAssert";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from "../../constants/http";
import mongoose, { isValidObjectId } from "mongoose";
import { createUserLog } from "../../services/auth.service";
import { UserLogType } from "../../constants/userLogTypes";

const deleteCard = async (req: Request & ProtectedRequest, res: Response) => {
  const { id } = req.params;
  appAssert(isValidObjectId(id), BAD_REQUEST, "Invalid card id");

  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  const userId = user._id as mongoose.Types.ObjectId;

  const card = await CardInfo.findById(id);
  appAssert(card, NOT_FOUND, "Card not found");

  appAssert(
    userId.equals(card.userId),
    FORBIDDEN,
    "You are not the owner of this card"
  );

  appAssert(user.cards.length > 1, BAD_REQUEST, "Cannot delete last card");

  if (user.mainCard?.equals(card._id as mongoose.Types.ObjectId)) {
    user.cards = user.cards.filter((card) => !card._id.equals(id));
    user.mainCard = user.cards[0];
  } else {
    user.cards = user.cards.filter((card) => !card._id.equals(id));
  }

  createUserLog(
    user,
    UserLogType.CardDeleted,
    "Card deleted with id: " + id,
    false
  );

  await user.save();
  await card.deleteOne();
  res.status(OK).json();
};

export default deleteCard;
