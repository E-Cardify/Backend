import { Request, Response } from "express";
import CardInfo from "../../models/CardInfo";
import { TokenizedRequest } from "../../types/express";

const deleteCard = async (req: Request, res: Response) => {
  const id = req.params?.["id"];
  const { user } = req as TokenizedRequest;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (user.cards.length === 1) {
    res.status(400).json({ message: "Cannot delete last card" });
    return;
  }

  try {
    const cardInfo = await CardInfo.findOne({ _id: id, owner: user._id });

    if (!cardInfo) {
      res.status(400).json({ message: "Card not found" });
      return;
    }

    const index = user.cards.findIndex((card) => card._id.toString() === id);

    if (index > -1) {
      user.cards.splice(index, 1);
    }

    if (user.mainCard == id) {
      user.mainCard = user.cards[0];
    }

    await user.save();
    await cardInfo.deleteOne();

    res.status(204).json();
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default deleteCard;
