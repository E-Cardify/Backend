import { Request, Response } from "express";
import { ProtectedRequest } from "../../types/ProtectedRequest";
import UserModel from "../../models/User.model";
import { NOT_FOUND, OK, UNAUTHORIZED } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { DeleteAccountSchema } from "./auth.schemas";
import { compareValue } from "../../utils/bcrypt";

const deleteAccount = async (
  req: Request & ProtectedRequest,
  res: Response
) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");

  const request = DeleteAccountSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { email, password } = request;

  const isMatch = compareValue(password, user.password);
  appAssert(isMatch, UNAUTHORIZED, "Invalid email or password");
  appAssert(email === user.email, UNAUTHORIZED, "Invalid email or password");

  await user.deleteOne();

  res.status(OK).json({ message: "Account has been deleted" });
};

export default deleteAccount;
