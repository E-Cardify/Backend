import { UserType } from "../models/User";

export const formatUserLoginResponse = (
  user: UserType,
  tokens?: { accessToken: string; refreshToken: string }
) => {
  if (tokens) {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      _id: user._id,
    };
  }

  return {
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isVerified: user.isVerified,
    _id: user._id,
  };
};
