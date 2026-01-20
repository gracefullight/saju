import { z } from "zod";

export const ShippingManagerParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export type ShippingManagerParams = z.infer<typeof ShippingManagerParamsSchema>;
