import assert from "node:assert";
import { HttpStatusCode } from "../constants/http";
import AppError from "./AppError";
import AppErrorCode from "../constants/AppErrorCode";

type Params = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

const appAssert: Params = (condition, httpStatusCode, message, appErrorCode) =>
  assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
