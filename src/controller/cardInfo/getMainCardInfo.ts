import { Request, Response } from "express";
import CardInfo, { CardInfoType } from "../../models/CardInfo";
import jwt from "jsonwebtoken";
import User from "../../models/User";

const getMainCardInfo = async (req: Request, res: Response) => {
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
  try {
    let cardInfo = await CardInfo.findOne<CardInfoType>({
      isMain: true,
      _id: { $in: user.cards },
    });

    if (!cardInfo) {
      if (user.cards.length === 0) {
        res.sendStatus(404);
        return;
      }
      const firstCard = await CardInfo.findById(user.cards[0]);
      if (!firstCard) {
        res.sendStatus(404);
        return;
      }
      cardInfo = firstCard;
      firstCard.isMain = true;
      await firstCard.save();
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
