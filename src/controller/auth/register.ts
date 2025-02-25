import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import { sendVerificationEMail } from "../../utils/mailUtils";
import { generateVerificationToken } from "../../utils/tokens";
import { createUserUpdateLog } from "../../utils/logUtils";

/**
 * Handles user registration by creating a new user account.
 */
const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  // Check for missing required fields
  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error("Error hashing password:", err);
      res.status(500).json({ message: "Error hashing password" });
      return;
    }

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    newUser.accountUpdateLogs.push(
      createUserUpdateLog("register", "User registered")
    );

    try {
      await newUser.save();
    } catch (err) {
      console.error("Error saving user:", err);
      res.status(500).json({ message: "Error saving user" });
      return;
    }

    res.status(201).json({
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });

    let currentUser;
    try {
      currentUser = await User.findById(newUser._id);
    } catch (err) {
      console.error("Error finding user:", err);
    }

    let emailId: string | undefined;
    try {
      const verificationToken = generateVerificationToken(
        email,
        newUser._id!.toString()
      );

      if (verificationToken) {
        emailId = await sendVerificationEMail(
          firstName,
          lastName,
          verificationToken
        );
      }
    } catch (err) {
      console.log(err);
    }

    try {
      if (currentUser && emailId) {
        currentUser.accountUpdateLogs.push(
          createUserUpdateLog(
            "email sent",
            `Verification email sent: ${emailId}`
          )
        );
        await currentUser.save();
      }
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default register;
