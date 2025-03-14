import { z } from "zod";

export const emailSchema = z.coerce
  .string()
  .email("Invalid email format")
  .min(4, "Email must be at least 4 characters long")
  .max(256, "Email cannot exceed 256 characters");

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(256, "Password cannot exceed 256 characters");

export const namesSchema = z
  .string()
  .min(1, "Name must be provided")
  .max(256, "Name cannot exceed 256 characters");

const userAgentSchema = z.string().optional();

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
