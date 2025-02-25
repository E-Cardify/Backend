import { UserUpdateLogType } from "../models/User";

export const createUserUpdateLog = (
  type: string,
  message: string
): UserUpdateLogType => {
  return {
    type: type,
    message: message,
  };
};
