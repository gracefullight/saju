import { z } from "zod";

export const UrgentInquirySearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    start_date: z.string().optional().describe("Creation start date (YYYY-MM-DD)"),
    end_date: z
      .string()
      .optional()
      .describe("Search end date for 'Post created date' (YYYY-MM-DD)"),
    offset: z
      .number()
      .int()
      .min(0)
      .max(8000)
      .default(0)
      .describe("Start location of list (default: 0)"),
    limit: z.number().int().min(1).max(100).default(10).describe("Limit (default: 10, max: 100)"),
  })
  .strict();

export const UrgentInquiryReplyParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    article_no: z.number().int().min(1).describe("posts number"),
  })
  .strict();

export const UrgentInquiryReplyCreateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    article_no: z.number().int().min(1).describe("posts number"),
    request: z.object({
      content: z.string().describe("Reply content"),
      status: z
        .enum(["F", "I", "T"])
        .default("F")
        .describe("status of replay (F: Unreplied, I: Replying, T: Replied)"),
      user_id: z.string().max(20).describe("manager ID of which processing or completed answer"),
      attach_file_urls: z
        .array(
          z.object({
            name: z.string().describe("filename"),
            url: z.string().url().describe("url of file"),
          }),
        )
        .optional()
        .describe("attached file detail"),
    }),
  })
  .strict();

export const UrgentInquiryReplyUpdateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    article_no: z.number().int().min(1).describe("posts number"),
    request: z.object({
      content: z.string().describe("Reply content"),
      status: z
        .enum(["F", "I", "T"])
        .describe("status of replay (F: Unreplied, I: Replying, T: Replied)"),
      user_id: z
        .string()
        .max(20)
        .optional()
        .describe("manager ID of which processing or completed answer"),
      attach_file_urls: z
        .array(
          z.object({
            name: z.string().describe("filename"),
            url: z.string().url().describe("url of file"),
          }),
        )
        .optional()
        .describe("attached file detail"),
    }),
  })
  .strict();

export type UrgentInquirySearchParams = z.infer<typeof UrgentInquirySearchParamsSchema>;
export type UrgentInquiryReplyParams = z.infer<typeof UrgentInquiryReplyParamsSchema>;
export type UrgentInquiryReplyCreateInput = z.infer<typeof UrgentInquiryReplyCreateSchema>;
export type UrgentInquiryReplyUpdateInput = z.infer<typeof UrgentInquiryReplyUpdateSchema>;
