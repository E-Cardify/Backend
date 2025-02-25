import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";

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
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default register;
