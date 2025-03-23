import mongoose, { Schema, model, Document } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";
import UserLogModel, { UserLogDocument } from "./UserLog.model";
import { UserLogType } from "../constants/userLogTypes";
import CardInfoModel, { CardInfoDocument } from "./CardInfo.model";
import { deleteUserAvatarImageHandler } from "../services/user.service";
// import { deleteUserAvatarImageHandler } from "../services/user.service";

export interface GetLogsParams {
  limit: number | undefined;
  offset: number | undefined;
  type: UserLogType | undefined;
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Pick<
    UserDocument,
    "_id" | "email" | "isVerified" | "createdAt" | "updatedAt"
  >;

  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;

  isVerified: boolean;
  accessToken: string;
  refreshToken: string;
  isAccountDeleted: boolean;

  avatarUrl?: string;
  avatarPublicId?: string;

  userLogs: mongoose.Types.ObjectId[];
  cards: mongoose.Types.ObjectId[];
  mainCard: mongoose.Types.ObjectId | null;
  maxCards: number;
  getLogs(params: GetLogsParams): Promise<UserLogDocument[]>;
  getCards(): Promise<CardInfoDocument[]>;
  getMainCard(): Promise<CardInfoDocument | null>;
}

const UserSchema = new Schema<UserDocument>(
  {
    userLogs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "UserLog",
      required: true,
      default: [],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    cards: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "CardInfo",
      default: [],
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    mainCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CardInfo",
      default: null,
    },
    maxCards: {
      type: Number,
      default: 1,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    avatarPublicId: {
      type: String,
      required: false,
    },
    isAccountDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const user = this as UserDocument;

    await deleteUserAvatarImageHandler(user);
    await UserLogModel.deleteMany({ userId: user._id });
    await CardInfoModel.deleteMany({
      userId: user._id,
    });

    next();
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashValue(this.password);
});

UserSchema.methods["comparePassword"] = async function (val: string) {
  return compareValue(val, this["password"]);
};

UserSchema.methods["omitPassword"] = function () {
  const user = this["toObject"]();

  delete user["password"];

  return user;
};

UserSchema.methods["getLogs"] = async function (params: GetLogsParams) {
  const maxLimit = this["userLogs"].length;
  const query: any = {};

  if (params.type) {
    query.type = params.type;
  }

  const logs = await UserLogModel.find({
    userId: this["_id"],
    ...query,
  })
    .sort({ createdAt: -1 })
    .skip(params.offset || 0)
    .limit(params.limit || maxLimit);

  return logs;
};

UserSchema.methods["getCards"] = async function () {
  await this["populate"]("cards");

  return this["cards"];
};

UserSchema.methods["getMainCard"] = async function () {
  const mainCard = await CardInfoModel.findById(this["mainCard"]);

  return mainCard;
};

const UserModel = model<UserDocument>("User", UserSchema);
export default UserModel;
