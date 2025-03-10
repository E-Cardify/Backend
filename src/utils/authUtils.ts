import User from "../models/User.model";
import bcrypt from "bcrypt";

// Find and validate user credentials
export const validateUserCredentials = async (
  email: string,
  password: string
) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  } catch (error) {
    console.error("Error validating user credentials:", error);
    throw new Error("Error validating user credentials");
  }
};
