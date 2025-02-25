import { Request, Response } from "express";
import { generateTokens } from "../../utils/tokens";
import { validateUserCredentials } from "../../utils/authUtils";
import bcrypt from "bcrypt";

export const updateUserPassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, email } = req.body;

  if (!oldPassword || !newPassword || !email) {
    res
      .status(400)
      .json({ message: "Old password, new password and email are required" });
    return;
  }

  if (oldPassword === newPassword) {
    res
      .status(400)
      .json({ message: "New password cannot be the same as the old password" });
    return;
  }

  let user;
  try {
    user = await validateUserCredentials(email, oldPassword);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  if (!user) {
    res
      .status(400)
      .json({ message: "User not found or old password is incorrect" });
    return;
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 10);
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ message: "Error hashing password" });
    return;
  }

  user.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  try {
    await generateTokens(user._id!.toString());
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
  res.status(200).json({ message: "Password updated successfully" });
};
