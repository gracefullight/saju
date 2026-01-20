import { z } from "zod";

export const DashboardParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default:1)"),
  })
  .strict();

export type DashboardParams = z.infer<typeof DashboardParamsSchema>;
