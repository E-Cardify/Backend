import { Types } from "mongoose";
import UserModel, { UserDocument } from "../models/User.model";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from "../constants/http";
import { deleteFromCloudinary, uploadToCloudinary } from "./cloudinary.service";
import FileModel from "../models/File.model";
import validateImageFileExtension from "../utils/validateFileExtensions";
import { imageExtensions } from "../constants/fileExtensions";
import { createUserLog } from "./auth.service";
import { UserLogType } from "../constants/userLogTypes";
import { CardInfoDocument } from "../models/CardInfo.model";

async function deleteUserAvatarImageHandler(user: UserDocument) {
  const { avatarPublicId } = user;

  if (avatarPublicId) {
    await deleteFromCloudinary(avatarPublicId);
    await FileModel.deleteOne({
      publicId: avatarPublicId,
      userId: user._id!.toString(),
    });

    user.avatarUrl = "";
    user.avatarPublicId = "";
  }
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

async function uploadUserAvatarImageHandler(
  userId: Types.ObjectId,
  file: Express.Multer.File
) {
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, "User not found");

  const isExtensionValid = validateImageFileExtension(file);
  appAssert(
    isExtensionValid,
    BAD_REQUEST,
    `Invalid file extension, supported: ${imageExtensions.join(", ")}`
  );

  await deleteUserAvatarImageHandler(user);

  const { url, publicId } = await uploadToCloudinary(file.buffer);

  const newFile = new FileModel({
    publicId: publicId,
    url: url,
    userId: user._id,
    public: true,
    type: "image",
  });

  user.avatarUrl = url;
  user.avatarPublicId = publicId;

  createUserLog(
    user,
    UserLogType.AccountUpdated,
    "Avatar image changed",
    false
  );

  await user.save();
  await newFile.save();

  return { user, file: newFile };
}

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

export {
  uploadUserAvatarImageHandler,
  uploadCardInfoAvatarImageHandler,
  deleteUserAvatarImageHandler,
  deleteCardInfoAvatarImageHandler,
};
