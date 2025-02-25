import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.mail.me.com",
  port: 587,
  secure: false,
  auth: {
    user: "zajacmaksymilian@icloud.com",
    pass: process.env["EMAIL_PASSWORD"],
  },
});

export { transporter };
