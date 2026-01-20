import { z } from "zod";

export const ShopListParamsSchema = z.object({}).strict();

export const ShopDetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).describe("Multi-shop number"),
  })
  .strict();

export type ShopListParams = z.infer<typeof ShopListParamsSchema>;
export type ShopDetailParams = z.infer<typeof ShopDetailParamsSchema>;
