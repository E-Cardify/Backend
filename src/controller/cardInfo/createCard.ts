import { Request, Response } from "express";
import { createCardInfoSchema } from "./cardInfo.schemas";
import { createCardInfo } from "../../services/cardInfo.service";
import { ProtectedRequest } from "../../types/ProtectedRequest";
import UserModel from "../../models/User.model";
import appAssert from "../../utils/appAssert";
import { CREATED, NOT_FOUND } from "../../constants/http";

const createCard = async (req: Request & ProtectedRequest, res: Response) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");

  const {
    information,
    design,
    fields,
    public: isPublic,
  } = createCardInfoSchema.parse(req.body);

  const { cardInfo } = await createCardInfo({
    information,
    design,
    fields,
    user,
    public: isPublic || false,
  });

  res.status(CREATED).json(cardInfo);
};

export default createCard;
