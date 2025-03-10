import { z } from "zod";

export const createCardInfoSchema = z.object({
  information: z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    preferredName: z.string().optional(),
    maidenName: z.string().optional(),
    pronouns: z.string().optional(),
    title: z.string().optional(),
    department: z.string().optional(),
    company: z.string().optional(),
    headline: z.string().optional(),
    motto: z.string().optional(),
  }),
  design: z.object({
    color: z.string().optional(),
    style: z.string().optional(),
  }),
  fields: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      text: z.string(),
    })
  ),
});
