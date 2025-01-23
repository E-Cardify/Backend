import CardInfo from "../../models/CardInfo";
import { Request, Response } from "express";

const createCard = async (req: Request, res: Response) => {
  const { information, design, fields } = req.body;

  if (!information || !design || !fields) {
    res.sendStatus(400);
    return;
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
