import { Request, Response } from "express";
import { NOT_FOUND, OK } from "../../constants/http";
import UserModel from "../../models/User.model";
import appAssert from "../../utils/appAssert";
import CardInfoModel from "../../models/CardInfo.model";
import { deleteCardInfoAvatarImageHandler } from "../../services/cardInfo.service";
import { createUserLog } from "../../services/auth.service";
import { UserLogType } from "../../constants/userLogTypes";

export const deleteCardInfoAvatarImage = async (
  req: Request,
  res: Response
) => {
  const { userId } = req;
  const { id } = req.params;
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, "User not found");

  const cardInfo = await CardInfoModel.findById(id);
  appAssert(cardInfo, NOT_FOUND, "Card not found");

  const { avatarPublicId, avatarUrl } = cardInfo;
  appAssert(avatarPublicId && avatarUrl, NOT_FOUND, "Avatar image not found");

  await deleteCardInfoAvatarImageHandler(user, cardInfo);

  await cardInfo.save();
  await createUserLog(
    user,
    UserLogType.CardUpdated,
    `Card avatar image deleted`
  );

  res.status(OK).json({ message: "Avatar image deleted" });
};
