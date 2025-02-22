import { isValidObjectId } from "mongoose";
import CardInfo from "../../models/CardInfo";
import { Request, Response } from "express";
import User from "../../models/User";
import jwt from "jsonwebtoken";
const createCard = async (req: Request, res: Response) => {
  const { information, design, fields, id } = req.body;

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  const decoded = jwt.verify(
    token,
    process.env["JWT_SECRET"] || "default-secret"
  ) as { userId: string };

  const user = await User.findById(decoded.userId);

  if (!user) {
    res.sendStatus(401);
    return;
  }

  let isMain = false;

  if (user.cards.length === 0) {
    isMain = true;
  }

  if (!information || !design || !fields) {
    res.sendStatus(400);
    return;
  }

  if (id && isValidObjectId(id)) {
    const cardInfo = await CardInfo.findById(id);

    if (cardInfo?.owner.toString() !== user._id!.toString()) {
      res.sendStatus(403);
      return;
    }

    if (cardInfo) {
      cardInfo.design = design;
      cardInfo.fields = fields;
      cardInfo.information = information;
      cardInfo.isMain = isMain;

      await cardInfo.save();
      res.status(201).json(cardInfo._id);
      user.cards.push(cardInfo._id!);
      await user.save();
      return;
    }
  }

  try {
    const newCardInfo = new CardInfo({
      information,
      design,
      fields,
      owner: user._id,
      isMain,
    });
    user.cards.push(newCardInfo._id!);
    await user.save();
    await newCardInfo.save();
    res.status(201).json(newCardInfo._id);
    return;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
};

export default createCard;
