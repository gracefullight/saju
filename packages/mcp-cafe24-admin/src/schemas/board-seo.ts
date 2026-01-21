import { z } from "zod";

export const BoardSEODetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("board number"),
  })
  .strict();

export const BoardSEOUpdateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("board number"),
    request: z.object({
      meta_title: z.string().max(100).optional().describe("Browser title"),
      meta_author: z.string().optional().describe("Meta tag 1: Author"),
      meta_description: z.string().optional().describe("Meta tag 2: Description"),
      meta_keywords: z.string().optional().describe("Meta tag 3: Keywords"),
    }),
  })
  .strict();

export type BoardSEODetailParams = z.infer<typeof BoardSEODetailParamsSchema>;
export type BoardSEOUpdateInput = z.infer<typeof BoardSEOUpdateSchema>;
