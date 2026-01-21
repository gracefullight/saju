import { z } from "zod";

export const CouponIssuanceCustomersSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    coupon_no: z.string().min(1).describe("Coupon number"),
    member_id: z.string().max(20).optional().describe("Member ID"),
    group_no: z.number().int().optional().describe("Group number"),
    since_member_id: z
      .string()
      .max(20)
      .optional()
      .describe("Search for issuance list after this member ID"),
    limit: z.number().int().min(1).max(500).default(10).describe("Limit"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location of list"),
  })
  .strict();

export type CouponIssuanceCustomersSearchParams = z.infer<
  typeof CouponIssuanceCustomersSearchParamsSchema
>;
