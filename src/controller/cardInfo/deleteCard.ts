import { isValidObjectId } from "mongoose";
import { Request, Response } from "express";
import CardInfo from "../../models/CardInfo";

const deleteCard = async (req: Request, res: Response) => {
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
    const cardInfo = await CardInfo.findOne({ _id: id });

    if (cardInfo && cardInfo.isMain) {
      const cards = await CardInfo.find();
      cards[0].isMain = true;

      await cards[0].save();
    }

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
