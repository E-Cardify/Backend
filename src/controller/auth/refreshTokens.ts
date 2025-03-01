import { Request, Response } from "express";
import { generateAccessToken, verifyRefreshToken } from "../../utils/tokens";
import User from "../../models/User";
import { formatUserLoginResponse } from "../../utils/responseUtils";
import { createUserUpdateLog } from "../../utils/logUtils";
import { serialize } from "cookie";

const refreshTokens = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
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

  user.accountUpdateLogs.push(
    createUserUpdateLog("refresh token", "Refresh token used")
  );

  try {
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  let accessToken;
  try {
    accessToken = await generateAccessToken(decoded.sub);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  const serializedAccessToken = serialize("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
    maxAge: 60 * 15,
    path: "/",
  });

  res.setHeader("Set-Cookie", serializedAccessToken);

  res.status(200).json(formatUserLoginResponse(user));
};

export default refreshTokens;
