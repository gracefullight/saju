import { z } from "zod";

export const SmsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default:1)"),
  })
  .strict();

export type SmsParams = z.infer<typeof SmsParamsSchema>;
