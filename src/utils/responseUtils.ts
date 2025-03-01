import { UserType } from "../models/User";

export const formatUserLoginResponse = (user: UserType) => {
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isVerified: user.isVerified,
    _id: user._id,
    mainCard: user.mainCard,
  };
};

export const formatUserPrivateDataResponse = (user: UserType) => {
  return {
    _id: user._id,
    mainCard: user.mainCard,
    cards: user.cards,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isVerified: user.isVerified,
    maxCards: user.maxCards,
  };
};
