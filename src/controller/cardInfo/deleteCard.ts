import { isValidObjectId } from "mongoose";
import { Request, Response } from "express";
import CardInfo from "../../models/CardInfo";
import jwt from "jsonwebtoken";
import User from "../../models/User";

const deleteCard = async (req: Request, res: Response) => {
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
    const cardInfo = await CardInfo.findOne({ _id: id, owner: user._id });

    if (cardInfo && cardInfo.isMain) {
      const cards = await CardInfo.find({ owner: user._id });
      cards[0].isMain = true;

      await cards[0].save();
    }

    const index = user.cards.findIndex((card) => card._id.toString() === id);

    if (index > -1) {
      user.cards.splice(index, 1);
    }
    await user.save();
    await CardInfo.findOneAndDelete({ _id: id });

    res.status(204).json();
    return;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
};

export default deleteCard;
