import { z } from "zod";

export const PromotionSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    benefit_no: z.number().optional().describe("Filter by benefit number"),
  })
  .strict();

export const PromotionDetailParamsSchema = z
  .object({
    promotion_no: z.number().describe("Promotion number"),
  })
  .strict();

export const PromotionCreateParamsSchema = z
  .object({
    promotion_no: z.number().describe("Promotion number"),
    promotion_name: z.string().describe("Promotion name"),
    apply_method: z.string().describe("Application method"),
    start_date: z.string().describe("Start date (YYYY-MM-DD)"),
    end_date: z.string().describe("End date (YYYY-MM-DD)"),
    discount_value: z.number().describe("Discount value"),
    discount_type: z.enum(["F", "P"]).describe("Discount type: F=Fixed, P=Percent"),
  })
  .strict();

export type PromotionSearchParams = z.infer<typeof PromotionSearchParamsSchema>;
export type PromotionDetailParams = z.infer<typeof PromotionDetailParamsSchema>;
export type PromotionCreateParams = z.infer<typeof PromotionCreateParamsSchema>;
