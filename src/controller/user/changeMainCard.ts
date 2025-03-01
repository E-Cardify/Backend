import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { TokenizedRequest } from "../../types/express";
import CardInfo from "../../models/CardInfo";

export const updateMainCard = async (req: Request, res: Response) => {
  const { user } = req as TokenizedRequest;
  const { id } = req.params;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid card id" });
    return;
  }

  let card;
  try {
    card = await CardInfo.findById(id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  if (!card) {
    res.status(400).json({ message: "Card not found" });
    return;
  }

  if (!card._id) {
    res.status(400).json({ message: "Card not found" });
    return;
  }

  if (!user.cards.map((id) => id.toString()).includes(card._id?.toString())) {
    res.status(400).json({ message: "Card not found" });
    return;
  }

  if (user.mainCard.toString() === card._id.toString()) {
    res.status(400).json({ message: "Card is already the main card" });
    return;
  }

  user.mainCard = card._id;
  await user.save();

  res.status(200).json(user.mainCard);

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
