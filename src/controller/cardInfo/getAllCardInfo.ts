import { Request, Response } from "express";
import CardInfo from "../../models/CardInfo";
import jwt from "jsonwebtoken";
import User from "../../models/User";

const getCardInfo = async (req: Request, res: Response) => {
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
    const cardInfo = await CardInfo.find({
      _id: { $in: user.cards },
    });

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
