import AppErrorCode from "../constants/AppErrorCode";
import { HttpStatusCode } from "../constants/http";

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;
