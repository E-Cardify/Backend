import rateLimit from "express-rate-limit";
import createLimiterResponse from "../utils/createLimiterResponse";

const minute = 1000 * 60;

const loginLimiter = rateLimit({
  windowMs: 5 * minute, //5 minutes
  max: 5,
  message: createLimiterResponse(
    "Too many login attempts, please try again later."
  ),
});

const deleteAccountLimiter = rateLimit({
  windowMs: 60 * minute, //5 minutes
  max: 3,
  message: createLimiterResponse(
    "Too many attempts, please try again in one hour."
  ),
});

export { loginLimiter, deleteAccountLimiter };
