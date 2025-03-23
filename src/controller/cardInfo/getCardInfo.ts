import { Request, Response } from "express";
import appAssert from "../../utils/appAssert";
import mongoose, { isValidObjectId } from "mongoose";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from "../../constants/http";
import CardInfoModel from "../../models/CardInfo.model";
import { formatCardInfoPublicDataResponse } from "../../utils/responseUtils";

const getCardInfo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req as { userId: mongoose.Types.ObjectId | undefined }; // user-id could be undefined

  appAssert(isValidObjectId(id), BAD_REQUEST, "Specified card id is not valid");

  const _id = new mongoose.Types.ObjectId(id);
  const cardInfo = await CardInfoModel.findById(_id);
  appAssert(cardInfo, NOT_FOUND, "Card with this id doesn't exist");

  appAssert(
    cardInfo.public === true ||
      cardInfo.userId.toString() === userId?.toString(),
    FORBIDDEN,
    "Card is not public"
  );

  res.status(OK).json(formatCardInfoPublicDataResponse(cardInfo));
};

export default getCardInfo;
