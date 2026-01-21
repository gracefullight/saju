import { z } from "zod";

export const CustomerCouponsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    member_id: z.string().min(1).describe("Member ID"),
    offset: z.number().int().min(0).max(10000).default(0).describe("Start location of list"),
    limit: z.number().int().min(1).max(100).default(10).describe("Limit"),
  })
  .strict();

export const CustomerCouponsCountParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    member_id: z.string().min(1).describe("Member ID"),
  })
  .strict();

export const CustomerCouponDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    member_id: z.string().min(1).describe("Member ID"),
    coupon_no: z.string().min(1).describe("Coupon number"),
    issue_no: z.string().min(1).optional().describe("Coupon issuance code"),
  })
  .strict();

export type CustomerCouponsSearchParams = z.infer<typeof CustomerCouponsSearchParamsSchema>;
export type CustomerCouponsCountParams = z.infer<typeof CustomerCouponsCountParamsSchema>;
export type CustomerCouponDeleteParams = z.infer<typeof CustomerCouponDeleteParamsSchema>;
