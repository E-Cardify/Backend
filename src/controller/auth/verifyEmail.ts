import { Request, Response } from "express";
import { verifyVerificationToken } from "../../utils/tokens";
import User from "../../models/User";
import { createUserUpdateLog } from "../../utils/logUtils";

const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  let decoded;
  try {
    decoded = verifyVerificationToken(token);
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid verification token" });
    return;
  }

  const user = await User.findOne({
    _id: decoded.sub,
    email: decoded.email,
  });
  if (!user) {
    res.status(401).json({ message: "User not found" });
    return;
  }

  if (user.isVerified) {
    res.status(401).json({ message: "User already verified" });
    return;
  }

  user.isVerified = true;
  user.accountUpdateLogs.push(
    createUserUpdateLog("email verified", "User verified")
  );
  try {
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  res.status(200).json({ message: "User verified successfully" });
};

export default verifyEmail;
