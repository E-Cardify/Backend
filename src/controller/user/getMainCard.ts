import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { TokenizedRequest } from "../../types/express";
import User from "../../models/User";
export const getMainCard = async (req: Request, res: Response) => {
  const { user } = req as TokenizedRequest;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const newUser = await User.findById(user._id).populate("mainCard");

  if (!newUser) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.status(200).json(newUser.mainCard);

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
