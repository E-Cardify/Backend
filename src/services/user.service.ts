import { Types } from "mongoose";
import UserModel, { UserDocument } from "../models/User.model";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, NOT_FOUND } from "../constants/http";
import { deleteFromCloudinary, uploadToCloudinary } from "./cloudinary.service";
import FileModel from "../models/File.model";
import validateImageFileExtension from "../utils/validateFileExtensions";
import { imageExtensions } from "../constants/fileExtensions";
import { createUserLog } from "./auth.service";
import { UserLogType } from "../constants/userLogTypes";

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

async function uploadAvatarImageHandler(
  userId: Types.ObjectId,
  file: Express.Multer.File
) {
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, "User not found");

  await deleteUserAvatarImageHandler(user);

  const isExtensionValid = validateImageFileExtension(file);
  appAssert(
    isExtensionValid,
    BAD_REQUEST,
    `Invalid file extension, supported: ${imageExtensions.join(", ")}`
  );

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

export { uploadAvatarImageHandler, deleteUserAvatarImageHandler };
