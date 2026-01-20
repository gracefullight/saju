import { z } from "zod";

export const CustomerSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    member_id: z.string().optional().describe("Filter by member ID"),
    search_keyword: z.string().optional().describe("Search keyword (name, email, phone)"),
    start_date: z.string().optional().describe("Registration start date (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("Registration end date (YYYY-MM-DD)"),
  })
  .strict();

export type CustomerSearchParams = z.infer<typeof CustomerSearchParamsSchema>;
