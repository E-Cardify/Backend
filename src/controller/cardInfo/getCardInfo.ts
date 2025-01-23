import { isValidObjectId } from "mongoose";
import { Request, Response } from "express";
import CardInfo from "../../models/CardInfo";

const getCardInfo = async (req: Request, res: Response) => {
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
      id: cardInfo._id,
      isMain: cardInfo.isMain,
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
};

export default getCardInfo;
