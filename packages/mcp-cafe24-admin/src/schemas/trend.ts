import { z } from "zod";

export const ListTrendsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    trend_code: z.string().optional().describe("Trend code (comma separated)"),
    trend_name: z.string().optional().describe("Trend name (comma separated)"),
    use_trend: z.enum(["T", "F"]).optional().describe("Whether to use trend"),
    offset: z
      .number()
      .int()
      .min(0)
      .max(8000)
      .optional()
      .default(0)
      .describe("Start location of list"),
    limit: z.number().int().min(1).max(100).optional().default(10).describe("Limit"),
  })
  .strict();

export const CountTrendsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    trend_code: z.string().optional().describe("Trend code (comma separated)"),
    trend_name: z.string().optional().describe("Trend name (comma separated)"),
    use_trend: z.enum(["T", "F"]).optional().describe("Whether to use trend"),
  })
  .strict();

export type ListTrends = z.infer<typeof ListTrendsSchema>;
export type CountTrends = z.infer<typeof CountTrendsSchema>;
