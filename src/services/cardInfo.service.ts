import appAssert from "../utils/appAssert";
import { BAD_REQUEST, CONFLICT, FORBIDDEN, NOT_FOUND } from "../constants/http";
import UserModel, { UserDocument } from "../models/User.model";
import mongoose, { Types } from "mongoose";
import CardInfoModel, {
  CardInfoDocument,
  DesignModel,
  FieldModel,
  InformationModel,
} from "../models/CardInfo.model";
import { createUserLog } from "./auth.service";
import { UserLogType } from "../constants/userLogTypes";
import validateImageFileExtension from "../utils/validateFileExtensions";
import { imageExtensions } from "../constants/fileExtensions";
import { deleteFromCloudinary, uploadToCloudinary } from "./cloudinary.service";
import FileModel from "../models/File.model";

export type CreateCardInfoParams = {
  information: {};
  design: {};
  fields: {
    label: string;
    value: string;
    text: string;
  }[];
  user: UserDocument;
  public?: boolean;
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
    public: data.public || false,
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

async function uploadCardInfoAvatarImageHandler(
  userId: Types.ObjectId,
  cardInfo: CardInfoDocument,
  file: Express.Multer.File
) {
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, "User not found");

  appAssert(
    cardInfo.userId.toString() === user._id!.toString(),
    FORBIDDEN,
    "You are not allowed to perform this action"
  );

  const isExtensionValid = validateImageFileExtension(file);
  appAssert(
    isExtensionValid,
    BAD_REQUEST,
    `Invalid file extension, supported: ${imageExtensions.join(", ")}`
  );

  await deleteCardInfoAvatarImageHandler(user, cardInfo);

  const { url, publicId } = await uploadToCloudinary(file.buffer);

  const newFile = new FileModel({
    publicId: publicId,
    url: url,
    userId: user._id,
    public: true,
    type: "image",
  });

  cardInfo.avatarUrl = url;
  cardInfo.avatarPublicId = publicId;

  createUserLog(
    user,
    UserLogType.CardUpdated,
    `Card with id ${cardInfo._id} avatar image changed`
  );

  await cardInfo.save();
  await newFile.save();

  return { user, file: newFile };
}

async function deleteCardInfoAvatarWhileCardInfoDeletion(
  avatarPublicId: string
) {
  await deleteFromCloudinary(avatarPublicId);
  await FileModel.deleteOne({
    publicId: avatarPublicId,
  });
}

async function deleteCardInfoAvatarImageHandler(
  user: UserDocument,
  cardInfo: CardInfoDocument
) {
  const { avatarPublicId } = cardInfo;

  if (avatarPublicId) {
    await deleteFromCloudinary(avatarPublicId);
    await FileModel.deleteOne({
      publicId: avatarPublicId,
      userId: user._id!.toString(),
    });

    cardInfo.avatarUrl = "";
    cardInfo.avatarPublicId = "";
  }
}

export {
  deleteCardInfoAvatarImageHandler,
  uploadCardInfoAvatarImageHandler,
  deleteCardInfoAvatarWhileCardInfoDeletion,
};
