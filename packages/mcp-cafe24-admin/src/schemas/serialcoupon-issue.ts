import { z } from "zod";

export const SerialCouponIssuesSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    coupon_no: z.string().describe("Coupon number"),
    offset: z.number().int().min(0).max(10000).default(0).describe("Start location of list"),
    limit: z.number().int().min(1).max(500).default(100).describe("Limit"),
  })
  .strict();

export const SerialCouponIssueCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    coupon_no: z.string().describe("Coupon number"),
    request: z
      .object({
        serial_code_list: z.array(z.string()).min(1).max(10000).describe("List of coupon codes"),
      })
      .strict()
      .describe("Issue request"),
  })
  .strict();

export type SerialCouponIssuesSearchParams = z.infer<typeof SerialCouponIssuesSearchParamsSchema>;
export type SerialCouponIssueCreateParams = z.infer<typeof SerialCouponIssueCreateParamsSchema>;
