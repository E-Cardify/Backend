import { z } from "zod";

export const createCardInfoSchema = z.object({
  information: z.object({
    firstName: z.string().max(256).optional(),
    middleName: z.string().max(256).optional(),
    lastName: z.string().max(256).optional(),
    preferredName: z.string().max(256).optional(),
    maidenName: z.string().max(256).optional(),
    pronouns: z.string().max(256).optional(),
    title: z.string().max(256).optional(),
    department: z.string().max(256).optional(),
    company: z.string().max(256).optional(),
    headline: z.string().max(2500).optional(),
    motto: z.string().max(256).optional(),
  }),
  design: z.object({
    color: z.string().max(256).optional(),
    style: z.string().max(256).optional(),
  }),
  fields: z.array(
    z.object({
      label: z.string().max(256),
      value: z.string().max(256),
      text: z.string().max(256),
    })
  ),
  public: z.boolean().optional(),
});

export const changeCardVisibilitySchema = z.object({
  public: z.boolean(),
});
