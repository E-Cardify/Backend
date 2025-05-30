import { Request, Response } from "express";
import { uploadUserAvatarImageHandler } from "../../services/user.service";
import { BAD_REQUEST, OK } from "../../constants/http";
import { formatUserPrivateDataResponse } from "../../utils/responseUtils";
import appAssert from "../../utils/appAssert";

export const uploadAvatarImage = async (req: Request, res: Response) => {
  const { userId, file } = req;
  appAssert(file, BAD_REQUEST, "Avatar image is missing");

  const { user } = await uploadUserAvatarImageHandler(userId, file);

  res.status(OK).json(formatUserPrivateDataResponse(user));
};
