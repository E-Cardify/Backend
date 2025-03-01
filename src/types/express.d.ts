import { UserType } from "../models/User";
import { Document } from "mongoose";

export {};

declare global {
  namespace Express {
    export interface Request {
      user: (UserType & Document) | undefined;
    }
  }
}

export interface TokenizedRequest {
  user: (UserType & Document) | undefined;
}
