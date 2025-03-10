import appAssert from "../utils/appAssert";
import { CONFLICT } from "../constants/http";
import { UserDocument } from "../models/User.model";
import mongoose from "mongoose";
import CardInfoModel, {
  DesignModel,
  FieldModel,
  InformationModel,
} from "../models/CardInfo.model";
import { createUserLog } from "./auth.service";
import { UserLogType } from "../constants/userLogTypes";

export type CreateCardInfoParams = {
  information: {};
  design: {};
  fields: {
    label: string;
    value: string;
    text: string;
  }[];
  user: UserDocument;
};

export const createCardInfo = async (data: CreateCardInfoParams) => {
  const user = data.user;
  appAssert(user.maxCards > user.cards.length, CONFLICT, "Max cards reached");

  const information = await InformationModel.create({
    ...data.information,
  });

  const design = await DesignModel.create({
    ...data.design,
  });

  const fields = await FieldModel.create([...data.fields]);

  const cardInfo = await CardInfoModel.create({
    information,
    design,
    fields,
    userId: user._id,
  });

  user.cards.push(cardInfo._id as mongoose.Types.ObjectId);
  if (user.mainCard === null) {
    user.mainCard = cardInfo._id as mongoose.Types.ObjectId;
    createUserLog(
      user,
      UserLogType.MainCardSet,
      "Main card set to " + cardInfo._id,
      false
    );
  }

  createUserLog(user, UserLogType.CardCreated, "Card created", false);

  await user.save();

  return {
    cardInfo,
  };
};
