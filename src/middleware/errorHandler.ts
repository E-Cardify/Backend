import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { ZodError } from "zod";
import AppError from "../utils/AppError";
import { clearAuthCookies } from "../utils/cookies";
import { REFRESH_PATH } from "../utils/cookies";

const handleZodError = (res: Response, err: ZodError) => {
  const errors = err.issues.map((err) => {
    return {
      path: err.path.join("."),
      message: err.message,
    };
  });

  res.status(BAD_REQUEST).json({
    message: "Missing or invalid information",
    errors: errors,
  });
};

const handleAppError = (res: Response, err: AppError) => {
  res.status(err.statusCode).json({
    message: err.message,
    errorCode: err.errorCode,
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.log(`Path: ${req.path}`);
  console.log(`Error: ${err}`);

  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  if (err instanceof AppError) {
    return handleAppError(res, err);
  }

  if (err instanceof ZodError) {
    return handleZodError(res, err);
  }

  res.status(INTERNAL_SERVER_ERROR).json({
    message: "Internal server error, try again later.",
  });
};
