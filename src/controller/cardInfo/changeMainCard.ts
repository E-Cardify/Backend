import { isValidObjectId } from "mongoose";
import { Request, Response } from "express";
import CardInfo from "../../models/CardInfo";
import jwt from "jsonwebtoken";
import User from "../../models/User";

const changeMainCard = async (req: Request, res: Response) => {
  const id = req.params?.["id"];

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

  if (!id) {
    res.sendStatus(400);
    return;
  }

  if (!isValidObjectId(id)) {
    res.sendStatus(400);
    return;
  }

  try {
    const mainCards = await CardInfo.find({
      isMain: true,
      _id: { $in: user.cards },
    });

    await Promise.all(
      mainCards.map((cardInfo) => {
        cardInfo.isMain = false;
        return cardInfo.save();
      })
    );

    const cardToUpdate = await CardInfo.findById(id);
    if (
      !cardToUpdate ||
      cardToUpdate.owner.toString() !== user._id!.toString()
    ) {
      res.sendStatus(403);
      return;
    }
    cardToUpdate.isMain = true;
    await cardToUpdate.save();

    res.status(204).json();
    return;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
};

export default changeMainCard;
