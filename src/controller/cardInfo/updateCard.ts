import CardInfo from "../../models/CardInfo";
import { Request, Response } from "express";
import { TokenizedRequest } from "../../types/express";
import { isValidObjectId } from "mongoose";

const updateCard = async (req: Request, res: Response) => {
  const { information, design, fields } = req.body;
  const { id } = req.params;
  const { user } = req as TokenizedRequest;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid card id" });
    return;
  }

  if (!information && !design && !fields) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const cardInfo = await CardInfo.findOne({ _id: id, owner: user._id });

    if (!cardInfo) {
      res.status(400).json({ message: "Card not found" });
      return;
    }

    cardInfo.information = information;
    cardInfo.design = design;
    cardInfo.fields = fields;

    await cardInfo.save();

    res.status(201).json(cardInfo._id);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default updateCard;
