import { Request, Response } from "express";
import { uploadAvatarImageHandler } from "../../services/user.service";
import { BAD_REQUEST, OK } from "../../constants/http";
import { formatUserPrivateDataResponse } from "../../utils/responseUtils";
import appAssert from "../../utils/appAssert";

export const uploadAvatarImage = async (req: Request, res: Response) => {
  const { userId, file } = req;
  appAssert(file, BAD_REQUEST, "Avatar image is missing");

  const { user } = await uploadAvatarImageHandler(userId, file);

  res.status(OK).json(formatUserPrivateDataResponse(user));
};
