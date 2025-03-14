/**
 * User authentication and account management routes
 *
 * This file defines the Express router for handling user-related endpoints including:
 * - User login
 * - New user registration
 */
import express from "express";
import login from "../controller/auth/login";
import register from "../controller/auth/register";
// import verifyAccessTokenHandler from "../controller/auth/verifyAccessTokenHandler";
import refresh from "../controller/auth/refresh";
import verifyEmail from "../controller/auth/verifyEmail";
import logout from "../controller/auth/logout";
// import checkToken from "../middleware/checkToken";
import resendEmail from "../controller/auth/resendEmail";
import { catchErrors } from "../utils/catchErrors";
import { authenticate } from "../middleware/authenticate";
import { loginLimiter } from "./auth.limiters";
const router = express.Router();

router.get(
  "/resend-email",
  catchErrors(authenticate),
  catchErrors(resendEmail)
);
router.post("/login", loginLimiter, catchErrors(login));
router.post("/register", catchErrors(register));
router.get("/logout", logout);

// router.post("/verify-access-token", checkToken, verifyAccessTokenHandler);
router.get("/refresh", catchErrors(refresh));

router.get("/verify-email/:code", catchErrors(verifyEmail));

export default router;
