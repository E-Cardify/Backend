import { Request, Response } from "express";
import { generateVerificationToken } from "../../utils/tokens";
import User from "../../models/User";
import { sendVerificationEMail } from "../../utils/mailUtils";
import { createUserUpdateLog } from "../../utils/logUtils";
import { TokenizedRequest } from "../../types/express";

export const updateUserData = async (req: Request, res: Response) => {
  const { user } = req as TokenizedRequest;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { firstName, lastName, email } = req.body;

  if (!firstName && !lastName && !email) {
    res.status(400).json({ message: "At least one field is required" });
    return;
  }

  if (firstName) {
    user.accountUpdateLogs.push(
      createUserUpdateLog(
        "first name updated",
        `First name updated from ${user.firstName} to ${firstName}`
      )
    );
    user.firstName = firstName;
  }

  if (lastName) {
    user.accountUpdateLogs.push(
      createUserUpdateLog(
        "last name updated",
        `Last name updated from ${user.lastName} to ${lastName}`
      )
    );
    user.lastName = lastName;
  }

  if (email) {
    if (email === user.email) {
      res.status(400).json({ message: "Email is already in use" });
      return;
    }

    user.accountUpdateLogs.push(
      createUserUpdateLog(
        "email updated",
        `Email updated from ${user.email} to ${email}`
      )
    );
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

  let currentUser;
  try {
    currentUser = await User.findById(user._id);
  } catch (err) {
    console.error("Error finding user:", err);
  }

  let emailId: string | undefined;
  if (email) {
    try {
      const verificationToken = generateVerificationToken(
        email,
        user._id!.toString()
      );
      emailId = await sendVerificationEMail(
        user.firstName,
        user.lastName,
        verificationToken
      );
    } catch (err) {
      console.log(err);
    }
  }

  try {
    if (currentUser && emailId) {
      currentUser.accountUpdateLogs.push(
        createUserUpdateLog("email sent", `Verification email sent: ${emailId}`)
      );
      await currentUser.save();
    }
  } catch (err) {
    console.log(err);
  }
};
