import { Request, Response } from "express";
import CardInfo, { CardInfoType } from "../../models/CardInfo";

const getMainCardInfo = async (_: Request, res: Response) => {
  try {
    const cardInfo = await CardInfo.findOne<CardInfoType>({
      isMain: true,
    });

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

export default getMainCardInfo;
