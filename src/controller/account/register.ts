import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";

const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await newUser.save();

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
