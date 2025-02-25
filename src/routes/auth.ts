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
import verifyAccessTokenHandler from "../controller/auth/verifyAccessTokenHandler";
import refreshTokens from "../controller/auth/refreshTokens";
import verifyEmail from "../controller/auth/verifyEmail";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

router.post("/verify-access-token", verifyAccessTokenHandler);
router.post("/refresh-tokens", refreshTokens);

router.get("/verify-email/:token", verifyEmail);

export default router;
