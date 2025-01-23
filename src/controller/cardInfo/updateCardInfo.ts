import { isValidObjectId } from "mongoose";
import CardInfo from "../../models/CardInfo";
import { Request, Response } from "express";

const updateCardInfo = async (req: Request, res: Response) => {
  const id = req.params?.["id"];
  const { information, design, fields } = req.body;

  if (!information || !design || !fields) {
    res.sendStatus(400);
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
    const cardInfo = await CardInfo.findById(id);

    if (!cardInfo) {
      res.sendStatus(404);
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
    res.sendStatus(500);
    return;
  }
};

export default updateCardInfo;
