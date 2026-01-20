import { z } from "zod";

export const CouponsSearchParamsSchema = z
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

export const CouponDetailParamsSchema = z
  .object({
    coupon_no: z.string().describe("Coupon number"),
  })
  .strict();

export const CouponCreateParamsSchema = z
  .object({
    benefit_no: z.number().describe("Benefit number"),
    coupon_no: z.string().describe("Coupon number"),
    coupon_type: z
      .enum(["D", "P", "B", "C", "E", "F", "G"])
      .describe("Coupon type: D=Discount, P=Percent, etc."),
    coupon_name: z.string().describe("Coupon name"),
    apply_method: z.string().describe("Application method"),
    valid_start_date: z.string().describe("Validity start date (YYYY-MM-DD)"),
    valid_end_date: z.string().describe("Validity end date (YYYY-MM-DD)"),
    discount_value: z.number().describe("Discount value"),
    issue_limit: z.number().optional().describe("Maximum issuance count"),
  })
  .strict();

export type CouponsSearchParams = z.infer<typeof CouponsSearchParamsSchema>;
export type CouponDetailParams = z.infer<typeof CouponDetailParamsSchema>;
export type CouponCreateParams = z.infer<typeof CouponCreateParamsSchema>;
