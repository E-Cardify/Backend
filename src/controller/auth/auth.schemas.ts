import { z } from "zod";
import {
  emailSchema,
  namesSchema,
  passwordSchema,
  userAgentSchema,
} from "../../lib/schemas";

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: userAgentSchema,
});

export const ResetPasswordSchema = z.object({
  newPassword: passwordSchema,
  password: passwordSchema,
});

export const registerSchema = LoginSchema.extend({
  firstName: namesSchema,
  lastName: namesSchema,
  privacyPolicy: z.boolean(),
});

export const verificationCodeSchema = z
  .string()
  .min(1, "Verification code must be at least 1 character long")
  .max(24, "Verification code cannot exceed 24 characters");
