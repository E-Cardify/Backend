import { Request, Response } from "express";
import User from "../../models/User";
import { verifyAccessToken } from "../../utils/tokens";
import { formatUserLoginResponse } from "../../utils/responseUtils";

const verifyAccessTokenHandler = async (req: Request, res: Response) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(400).json({ message: "Access token is required" });
    return;
  }

  try {
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Invalid access token" });
      return;
    }

    let user;
    try {
      user = await User.findById(decoded.sub);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Internal server error" });
      return;
    }

    if (!user) {
      res.status(401).json({ message: "Invalid access token" });
      return;
    }

    console.log(user.accessToken);
    console.log(token);
    if (user.accessToken !== token) {
      res.status(401).json({ message: "Access token is invalid or expired" });
      return;
    }

    res.status(200).json(formatUserLoginResponse(user));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyAccessTokenHandler;
