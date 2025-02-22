import { Request, Response } from "express";
import User from "../../models/User";
import jwt from "jsonwebtoken";

const verify = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token as string,
      process.env["REFRESH_TOKEN_SECRET"] || "refresh-secret"
    ) as { userId: string };

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    if (user.refreshToken !== token) {
      res.status(401).json({ message: "Token is invalid or expired" });
      return;
    }

    res.status(200).json({
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user.id,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default verify;
