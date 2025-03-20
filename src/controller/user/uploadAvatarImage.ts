import { Request, Response } from "express";
import UserModel from "../../models/User.model";
import { BAD_REQUEST, NOT_FOUND, OK } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { formatUserPrivateDataResponse } from "../../utils/responseUtils";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../services/cloudinary.service";
import { imageExtensions } from "../../constants/fileExtensions";
import validateImageFileExtension from "../../utils/validateFileExtensions";
import FileModel from "../../models/File.model";

export const uploadAvatarImage = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  appAssert(req.file, BAD_REQUEST, "Avatar image is missing");

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

  const isExtensionValid = validateImageFileExtension(req.file);
  appAssert(
    isExtensionValid,
    BAD_REQUEST,
    `Invalid file extension, supported: ${imageExtensions.join(", ")}`
  );

  const { url, publicId } = await uploadToCloudinary(req.file.buffer);

  const file = new FileModel({
    publicId: publicId,
    url: url,
    userId: user._id,
    public: true,
    type: "image",
  });

  user.avatarUrl = url;
  user.avatarPublicId = publicId;

  await user.save();
  await file.save();

  res.status(OK).json(formatUserPrivateDataResponse(user));
};
