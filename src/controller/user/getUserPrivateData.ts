import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { TokenizedRequest } from "../../types/express";
import { formatUserPrivateDataResponse } from "../../utils/responseUtils";
import { UserType } from "../../models/User";

export const getUserPrivateData = async (req: Request, res: Response) => {
  const { user } = req as TokenizedRequest;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.status(200).json(formatUserPrivateDataResponse(user as UserType));

  try {
    if (
      isValidObjectId(user.cards[0]) &&
      (user.mainCard.toString() === "" || !isValidObjectId(user.mainCard))
    ) {
      user.mainCard = user.cards[0];
      await user.save();
    }
  } catch (err) {
    console.log(err);
  }
};
