import { Request, Response } from "express";
import { sendVerificationEMail } from "../../utils/mailUtils";
import { generateVerificationToken } from "../../utils/tokens";
import { createUserUpdateLog } from "../../utils/logUtils";
import { TokenizedRequest } from "../../types/express";

const resendEmail = async (req: Request, res: Response) => {
  const { user } = req as TokenizedRequest;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (user.isVerified) {
    res.status(400).json({ message: "Email already verified" });
    return;
  }

  let emailId: string | undefined;
  try {
    const verificationToken = generateVerificationToken(
      user.email,
      user._id!.toString()
    );

    if (verificationToken) {
      emailId = await sendVerificationEMail(
        user.firstName,
        user.lastName,
        verificationToken
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  try {
    if (user && emailId) {
      user.accountUpdateLogs.push(
        createUserUpdateLog("email sent", `Verification email sent: ${emailId}`)
      );
      await user.save();
    }
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({ message: "Email sent" });
};

export default resendEmail;
