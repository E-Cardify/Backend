import { z } from "zod";

export const emailSchema = z.coerce.string().email().min(5);
export const passwordSchema = z.string().min(6).max(255);
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
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
});

export const verificationCodeSchema = z.string().min(1).max(24);
