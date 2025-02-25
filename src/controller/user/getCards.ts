import { Request, Response } from "express";
import { verifyAccessToken } from "../../utils/tokens";
import User from "../../models/User";

export const getCards = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid token" });
    return;
  }

  let user;
  try {
    user = await User.findById(decoded.sub);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  res.status(200).json(user.cards);
};
