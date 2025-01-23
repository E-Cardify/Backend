import { Request, Response } from "express";
import CardInfo from "../../models/CardInfo";

const getCardInfo = async (_: Request, res: Response) => {
  try {
    const cardInfo = await CardInfo.find();

    const responseData = cardInfo.map((cardInfo) => {
      return {
        information: cardInfo.information,
        design: cardInfo.design,
        isMain: cardInfo.isMain,
        fields: cardInfo.fields.map((field) => {
          return {
            label: field.label,
            value: field.value,
          };
        }),
        id: cardInfo._id,
      };
    });
    res.status(200).json(responseData);
    return;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
};

export default getCardInfo;
