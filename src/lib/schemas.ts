import { z } from "zod";

const emailSchema = z.coerce
  .string()
  .email("Invalid email format")
  .min(4, "Email must be at least 4 characters long")
  .max(256, "Email cannot exceed 256 characters");

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(256, "Password cannot exceed 256 characters");

const namesSchema = z
  .string()
  .min(1, "Name must be provided")
  .max(256, "Name cannot exceed 256 characters");

const userAgentSchema = z.string().optional();

export { emailSchema, passwordSchema, namesSchema, userAgentSchema };
