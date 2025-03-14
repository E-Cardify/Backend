import rateLimit from "express-rate-limit";
import createLimiterResponse from "../utils/createLimiterResponse";

const minute = 1000 * 60;

const loginLimiter = rateLimit({
  windowMs: 5 * minute,
  max: 5,
  message: createLimiterResponse(
    "Too many login attempts, please try again later."
  ),
});

export { loginLimiter };
