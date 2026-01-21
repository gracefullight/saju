import { z } from "zod";

export const CustomerPlusAppParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    member_id: z.string().max(20).describe("Member ID"),
  })
  .strict();
