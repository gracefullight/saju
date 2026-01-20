import { z } from "zod";

export const CurrencyParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const CurrencyUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).describe("Multi-shop number (required)"),
    exchange_rate: z.string().describe("Exchange rate (e.g., '1004.00')"),
  })
  .strict();

export type CurrencyParams = z.infer<typeof CurrencyParamsSchema>;
export type CurrencyUpdateParams = z.infer<typeof CurrencyUpdateParamsSchema>;
