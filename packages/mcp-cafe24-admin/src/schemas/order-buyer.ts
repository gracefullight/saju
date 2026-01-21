import { z } from "zod";

export const BuyerParamsSchema = z
  .object({
    order_id: z.string().describe("Order ID"),
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
  })
  .strict();

export const BuyerUpdateParamsSchema = z
  .object({
    order_id: z.string().describe("Order ID"),
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    request: z
      .object({
        name: z.string().optional().describe("Buyer name"),
        email: z.string().email().optional().describe("Buyer email"),
        phone: z.string().optional().describe("Buyer phone number"),
        cellphone: z.string().optional().describe("Buyer mobile number"),
        customer_notification: z.string().optional().describe("Customer notification"),
      })
      .describe("Buyer update details"),
  })
  .strict();
