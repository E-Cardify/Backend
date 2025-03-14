import mongoose from "mongoose";
import { transporter } from "../config/nodemailer";
import { UserDocument } from "../models/User.model";
import { createUserLog } from "./auth.service";
import { UserLogType } from "../constants/userLogTypes";
import { ENVIRONMENT } from "../constants/env";

export async function sendVerificationMail(
  user: UserDocument,
  code: mongoose.Types.ObjectId
) {
  if (ENVIRONMENT === "production") {
    try {
      let info = await transporter.sendMail({
        from: '"Cardify" <zajacmaksymilian@icloud.com>',
        to: user.email,
        subject: "Cardify - Account verification",
        text: `
        Hello, ${user.firstName} ${user.lastName}!

        Please verify your account by clicking on the link below:

        http://localhost:5000/api/v1/auth/verify-email/${code}

        Best regards,
      `,
      });
      console.log("E-mail sent:", info.messageId);
      await createUserLog(user, UserLogType.EmailSent, "Email sent");
      return info.messageId;
    } catch (error) {
      console.error("Error sending email:", error);
      return null;
    }
  }

  return null;
}
