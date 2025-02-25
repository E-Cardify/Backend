import { Request, Response } from "express";
import { generateTokens, verifyRefreshToken } from "../../utils/tokens";
import User from "../../models/User";
import { formatUserLoginResponse } from "../../utils/responseUtils";

const refreshTokens = async (req: Request, res: Response) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid refresh token" });
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
    res.status(401).json({ message: "Invalid refresh token" });
    return;
  }

  try {
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  let tokens;
  try {
    tokens = await generateTokens(decoded.sub);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  res.status(200).json(formatUserLoginResponse(user, tokens));
};

export default refreshTokens;
