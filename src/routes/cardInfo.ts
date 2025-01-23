import express, { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import CardInfo from "../models/CardInfo";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
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
    const cardInfo = await CardInfo.findById(id);

    if (!cardInfo) {
      res.sendStatus(404);
      return;
    }

    const responseData = {
      information: cardInfo.information,
      design: cardInfo.design,
      fields: cardInfo.fields.map((field) => {
        return {
          label: field.label,
          value: field.value,
        };
      }),
    };

    res.status(200).json({ ...responseData });
    return;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
});

router.post("/create", async (req: Request, res: Response) => {
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
    res.status(201).json(newCardInfo.id);
    return;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
});

export default router;
