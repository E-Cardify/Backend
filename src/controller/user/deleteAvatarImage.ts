import { Request, Response } from "express";
import { NOT_FOUND, OK } from "../../constants/http";
import UserModel from "../../models/User.model";
import appAssert from "../../utils/appAssert";
import { deleteUserAvatarImageHandler } from "../../services/user.service";

export const deleteAvatarImage = async (req: Request, res: Response) => {
  const { userId } = req;
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, "User not found");

  const { avatarPublicId, avatarUrl } = user;
  appAssert(avatarPublicId && avatarUrl, NOT_FOUND, "Avatar image not found");

  await deleteUserAvatarImageHandler(user);

  await user.save();

  res.status(OK).json({ message: "Avatar image deleted" });
};
