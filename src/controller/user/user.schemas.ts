import { z } from "zod";
import { UserLogType } from "../../constants/userLogTypes";
import { emailSchema, passwordSchema } from "../auth/auth.schemas";

export const getLogsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  type: z.nativeEnum(UserLogType).optional(),
});

export const updateUserDataSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    birthDate: z.coerce.date().nullable().optional(),
  })
  .refine(
    (data) => data.email || data.lastName || data.firstName || data.password,
    {
      message:
        "At least one of email, firstName, password, or lastName must be provided",
      path: ["email"],
    }
  );
