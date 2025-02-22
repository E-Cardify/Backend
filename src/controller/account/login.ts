import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Missing email or password" });
    return;
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env["JWT_SECRET"] || "default-secret",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env["REFRESH_TOKEN_SECRET"] || "refresh-secret",
      { expiresIn: "7d" }
    );

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user.id,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default login;
