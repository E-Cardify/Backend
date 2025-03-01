import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens";
import User from "../models/User";
import { TokenizedRequest } from "../types/express";

export default async function checkToken(
  req: Request & TokenizedRequest,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.cookies["accessToken"] as string | undefined;

  if (!accessToken) {
    res.status(401).json({ message: "Invalid Access Token" });
    return;
  }

  let decoded;
  try {
    decoded = verifyAccessToken(accessToken);
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid Access Token" });
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
    res.status(401).json({ message: "Invalid Access Token" });
    return;
  }

  req.user = user;
  next();
}
