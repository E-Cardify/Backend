import { isValidObjectId } from "mongoose";
import { Request, Response } from "express";
import CardInfo from "../../models/CardInfo";

const changeMainCard = async (req: Request, res: Response) => {
  const id = req.params?.["id"];

  if (!id) {
    res.sendStatus(400);
    return;
  }

  if (!isValidObjectId(id)) {
    res.sendStatus(400);
    return;
  }

  try {
    const mainCards = await CardInfo.find({ isMain: true });

    await Promise.all(
      mainCards.map((cardInfo) => {
        cardInfo.isMain = false;
        return cardInfo.save();
      })
    );

    await CardInfo.findByIdAndUpdate(id, { isMain: true });

    res.status(204).json();
    return;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
};

export default changeMainCard;
