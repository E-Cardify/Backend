import { transporter } from "../config/nodemailer";

export async function sendVerificationEMail(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  token: string
) {
  try {
    let info = await transporter.sendMail({
      from: '"Cardify" <zajacmaksymilian@icloud.com>',
      to: "zajacmaksymilian@icloud.com",
      subject: "Cardify - Account verification",
      text: `
        Hello, ${firstName} ${lastName}!

        Please verify your account by clicking on the link below:

        http://localhost:5000/api/v1/auth/verify-email/${token}

        Best regards,
      `,
    });
    console.log("E-mail sent:", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
}
