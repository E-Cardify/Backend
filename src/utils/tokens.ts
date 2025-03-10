import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import User from "../models/User.model";

/**
 * Generates authentication tokens for a user session
 *
 * Creates an access token valid for 15 minutes and a refresh token valid for 7 days.
 * The access token is used for API authorization while the refresh token can obtain
 * new access tokens.
 *
 * Token signing uses environment variables JWT_SECRET and REFRESH_TOKEN_SECRET,
 * defaulting to fallback values if not set.
 *
 * @throws {Error} If token generation fails
 */
const generateTokens = async (userId: string) => {
  try {
    const minute = 60 * 1000;
    const accessToken = jwt.sign(
      { sub: userId, iat: Date.now(), exp: Date.now() + 15 * minute },
      process.env["JWT_SECRET"] || "default-secret"
    );

    const month = 60 * 60 * 24 * 30;
    const refreshToken = jwt.sign(
      { sub: userId, iat: Date.now(), exp: Date.now() + month },
      process.env["REFRESH_TOKEN_SECRET"] || "refresh-secret"
    );

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error("Failed to generate tokens");
  }
};

const generateAccessToken = async (userId: string) => {
  try {
    const minute = 60 * 1000;
    const accessToken = jwt.sign(
      { sub: userId, iat: Date.now(), exp: Date.now() + 15 * minute },
      process.env["JWT_SECRET"] || "default-secret"
    );

    return accessToken;
  } catch (err) {
    throw new Error("Failed to generate tokens");
  }
};

const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env["JWT_SECRET"] || "default-secret"
    ) as { sub: string; iat: number; exp: number };

    if (!decoded.sub) {
      throw new Error("Invalid access token");
    }

    if (!isValidObjectId(decoded.sub)) {
      throw new Error("Invalid access token");
    }

    if (decoded.exp < Date.now()) {
      throw new Error("Access token expired");
    }

    return decoded;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to verify access token");
  }
};

const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env["REFRESH_TOKEN_SECRET"] || "refresh-secret"
    ) as { sub: string; iat: number; exp: number };

    if (!decoded.sub) {
      throw new Error("Invalid refresh token");
    }

    if (!isValidObjectId(decoded.sub)) {
      throw new Error("Invalid refresh token");
    }

    if (decoded.exp < Date.now()) {
      throw new Error("Refresh token expired");
    }

    return decoded;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to verify refresh token");
  }
};

const generateVerificationToken = (email: string, userId: string) => {
  try {
    return jwt.sign(
      { sub: userId, iat: Date.now(), email },
      process.env["VERIFICATION_TOKEN_SECRET"] || "verification-secret"
    );
  } catch (err) {
    throw new Error("Failed to generate verification token");
  }
};

/**
    sub - userId
    email - email
 */
const verifyVerificationToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env["VERIFICATION_TOKEN_SECRET"] || "verification-secret"
    ) as { sub: string; iat: number; email: string };

    if (!decoded.sub) {
      throw new Error("Invalid verification token");
    }

    return decoded;
  } catch (err) {
    throw new Error("Failed to verify verification token");
  }
};

export {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  generateVerificationToken,
  verifyVerificationToken,
  generateAccessToken,
};
