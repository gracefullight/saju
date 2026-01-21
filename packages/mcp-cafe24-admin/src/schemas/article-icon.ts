import { z } from "zod";

export const ArticleIconsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    type: z.enum(["pc", "mobile"]).default("pc").describe("Type: pc, mobile (default: pc)"),
  })
  .strict();

export const ArticleIconUpdateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    id: z.number().int().min(1).describe("Icon ID"),
    group_code: z
      .enum(["A", "B", "C", "E"])
      .describe("Group codes: A=Product icons, B=Board icons, C=Card icons, E=Event icons"),
    type: z.enum(["pc", "mobile"]).default("pc").describe("Type: pc, mobile (default: pc)"),
    path: z.string().url().optional().describe("Icon URL"),
    display: z
      .enum(["T", "F"])
      .optional()
      .describe("Check whether icon is displayed. T: Yes, F: No."),
  })
  .strict();

export type ArticleIconsSearchParams = z.infer<typeof ArticleIconsSearchParamsSchema>;
export type ArticleIconUpdateInput = z.infer<typeof ArticleIconUpdateSchema>;
