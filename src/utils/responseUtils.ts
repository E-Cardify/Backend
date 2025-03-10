import { CardInfoDocument } from "../models/CardInfo.model";
import { UserDocument } from "../models/User.model";

const formatUserLoginResponse = (user: UserDocument) => {
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isVerified: user.isVerified,
    _id: user._id,
    mainCard: user.mainCard,
  };
};

const formatUserPrivateDataResponse = (user: UserDocument) => {
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

const formatCardInfoPublicDataResponse = (cardInfo: CardInfoDocument) => {
  return {
    _id: cardInfo._id,
    information: cardInfo.information,
    design: cardInfo.design,
    fields: cardInfo.fields,
    userId: cardInfo.userId,
    createdAt: cardInfo.createdAt,
    updateAt: cardInfo.updatedAt,
  };
};

export {
  formatUserLoginResponse,
  formatUserPrivateDataResponse,
  formatCardInfoPublicDataResponse,
};
