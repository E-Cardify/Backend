import { Request, Response } from "express";
import { strictVerifyAccessToken } from "../../utils/tokens";
import User from "../../models/User";

export const updateUserData = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { firstName, lastName, email } = req.body;

  if (!firstName && !lastName && !email) {
    res.status(400).json({ message: "At least one field is required" });
    return;
  }

  if (!token) {
    res.status(400).json({ message: "Token is required" });
    return;
  }

  let decoded;
  try {
    decoded = await strictVerifyAccessToken(token);
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

  if (firstName) {
    user.firstName = firstName;
  }

  if (lastName) {
    user.lastName = lastName;
  }

  if (email) {
    user.email = email;
    user.isVerified = false;
  }

  try {
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  res.status(200).json({ message: "User data updated successfully" });
};
