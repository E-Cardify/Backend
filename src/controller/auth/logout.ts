import { Request, Response } from "express";
import { serialize } from "cookie";

export default function logout(_: Request, res: Response) {
  const serializedRefreshToken = serialize("refreshToken", "", {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  const serializedAccessToken = serialize("accessToken", "", {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  res.setHeader("Set-Cookie", [serializedRefreshToken, serializedAccessToken]);
  res.status(200).json({ message: "Logged out" });
}
