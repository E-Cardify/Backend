import { isValidObjectId } from "mongoose";
import CardInfo from "../../models/CardInfo";
import { Request, Response } from "express";

const createCard = async (req: Request, res: Response) => {
  const { information, design, fields, id } = req.body;

  if (!information || !design || !fields) {
    res.sendStatus(400);
    return;
  }

  if (id && isValidObjectId(id)) {
    const cardInfo = await CardInfo.findById(id);

    if (cardInfo) {
      cardInfo.design = design;
      cardInfo.fields = fields;
      cardInfo.information = information;

      await cardInfo.save();
      res.status(201).json(cardInfo._id);
      return;
    }
  }

  try {
    const newCardInfo = new CardInfo({
      information,
      design,
      fields,
    });
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
