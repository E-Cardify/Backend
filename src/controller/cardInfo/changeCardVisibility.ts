import { Request, Response } from "express";
import { changeCardVisibilitySchema } from "./cardInfo.schemas";
import { ProtectedRequest } from "../../types/ProtectedRequest";
import UserModel from "../../models/User.model";
import appAssert from "../../utils/appAssert";
import { CREATED, FORBIDDEN, NOT_FOUND } from "../../constants/http";
import CardInfoModel from "../../models/CardInfo.model";
import { createUserLog } from "../../services/auth.service";
import { UserLogType } from "../../constants/userLogTypes";

const changeCardVisibility = async (
  req: Request & ProtectedRequest,
  res: Response
) => {
  const { id } = req.params;
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");

  const { public: isPublic } = changeCardVisibilitySchema.parse(req.body);

  const cardInfo = await CardInfoModel.findById(id);
  appAssert(cardInfo, NOT_FOUND, "Card not found");
  appAssert(
    cardInfo.userId.toString() === user._id!.toString(),
    FORBIDDEN,
    "That card doesn't belong to you"
  );

  cardInfo.public = isPublic;
  await cardInfo.save();
  await createUserLog(
    user,
    UserLogType.CardUpdated,
    `Changed card visibility to ${isPublic}`
  );

  res.status(CREATED).json(cardInfo);
};

export default changeCardVisibility;
