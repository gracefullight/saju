import { z } from "zod";

export const CustomerPaymentInfoParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    member_id: z.string().max(20).describe("Member ID"),
  })
  .strict();

export const DeletePaymentMethodParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    member_id: z.string().max(20).describe("Member ID"),
    payment_method_id: z.string().describe("Payment method ID"),
  })
  .strict();
