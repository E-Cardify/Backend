import { Request, Response } from "express";
import { uploadCardInfoAvatarImageHandler } from "../../services/cardInfo.service";
import { BAD_REQUEST, OK } from "../../constants/http";
import { formatUserPrivateDataResponse } from "../../utils/responseUtils";
import appAssert from "../../utils/appAssert";
import CardInfoModel from "../../models/CardInfo.model";

export const uploadAvatarImage = async (req: Request, res: Response) => {
  const { userId, file } = req;
  const { id } = req.params;
  appAssert(file, BAD_REQUEST, "Avatar image is missing");

  const cardInfo = await CardInfoModel.findById(id);
  appAssert(cardInfo, BAD_REQUEST, "Card info not found");

  const { user } = await uploadCardInfoAvatarImageHandler(
    userId,
    cardInfo,
    file
  );

  res.status(OK).json(formatUserPrivateDataResponse(user));
};
