import { z } from "zod";

export const CustomerPropertiesParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    type: z
      .enum(["join", "edit"])
      .default("join")
      .describe("Signup field type (join: fields, edit: fields to edit)"),
  })
  .strict();
