import { isValidObjectId } from "mongoose";
import CardInfo from "../../models/CardInfo";
import { Request, Response } from "express";
import { TokenizedRequest } from "../../types/express";

const createCard = async (req: Request, res: Response) => {
  const { information, design, fields } = req.body;
  const { user } = req as TokenizedRequest;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (user.cards.length >= user.maxCards) {
    res.status(400).json({ message: "Max cards reached" });
    return;
  }

  let isMain = false;

  if (user.cards.length === 0) {
    isMain = true;
  }

  if (user.mainCard == null || !isValidObjectId(user.mainCard)) {
    isMain = true;
  }

  try {
    const cardInfo = new CardInfo({
      information,
      design,
      fields,
      owner: user._id,
    });

    user.cards.push(cardInfo._id!);
    if (isMain) {
      user.mainCard = cardInfo._id!;
    }
    await user.save();
    await cardInfo.save();
    res.status(201).json(cardInfo._id);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default createCard;
