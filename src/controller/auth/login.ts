import { Request, Response } from "express";
import { generateTokens } from "../../utils/tokens";
import { validateUserCredentials } from "../../utils/authUtils";
import { formatUserLoginResponse } from "../../utils/responseUtils";
import { createUserUpdateLog } from "../../utils/logUtils";

/**
 * Handles user login by validating credentials and generating authentication tokens.
 */
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check for missing email or password
  if (!email || !password) {
    res.status(400).json({ message: "Missing email or password" });
    return;
  }

  try {
    // Validate user credentials
    let user;
    try {
      user = await validateUserCredentials(email, password);
    } catch (err) {
      console.error("Error validating user credentials:", err);
      res.status(500).json({ message: "Error validating user credentials" });
      return;
    }

    // Check if user was found
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    if (!user._id) {
      res.status(500).json({ message: "User ID not found" });
      return;
    }

    user.accountUpdateLogs.push(createUserUpdateLog("login", "User logged in"));

    // Save updated user information
    try {
      await user.save();
    } catch (err) {
      console.error("Error saving user:", err);
      res.status(500).json({ message: "Error saving user" });
      return;
    }

    // Generate authentication tokens
    let tokens;
    try {
      tokens = await generateTokens(user._id.toString());
    } catch (err) {
      console.error("Failed to generate auth tokens:", err);
      res
        .status(500)
        .json({ message: "Error generating authentication tokens" });
      return;
    }

    // Respond with formatted user login response
    res.status(200).json(formatUserLoginResponse(user, tokens));
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default login;
