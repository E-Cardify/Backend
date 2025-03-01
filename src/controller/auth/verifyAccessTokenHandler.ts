import { Request, Response } from "express";
import { formatUserLoginResponse } from "../../utils/responseUtils";
import { TokenizedRequest } from "../../types/express";
import { UserType } from "../../models/User";

const verifyAccessTokenHandler = async (req: Request, res: Response) => {
  const { user } = req as TokenizedRequest;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.status(200).json(formatUserLoginResponse(user as UserType));
};

export default verifyAccessTokenHandler;
