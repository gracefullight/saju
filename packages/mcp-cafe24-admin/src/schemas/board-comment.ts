import { z } from "zod";

export const BoardAllCommentsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("board number"),
    since_comment_no: z
      .number()
      .int()
      .min(1)
      .max(2147483647)
      .optional()
      .describe("Retrieve comments after the corresponding comment"),
    limit: z.number().int().min(1).max(100).default(10).describe("Limit"),
  })
  .strict();

export const BoardCommentsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("board number"),
    article_no: z.number().int().describe("posts number"),
    comment_no: z.number().int().optional().describe("Comment number"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location of list"),
    limit: z.number().int().min(1).max(100).default(10).describe("Limit"),
  })
  .strict();

export const BoardCommentCreateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("board number"),
    article_no: z.number().int().describe("posts number"),
    request: z.object({
      content: z.string().describe("comment content"),
      writer: z.string().max(100).describe("writer"),
      password: z.string().min(1).max(20).describe("comment password"),
      member_id: z.string().max(20).optional().describe("Member id"),
      rating: z.number().int().min(1).max(5).default(0).describe("comment rating"),
      secret: z.enum(["T", "F"]).default("F").describe("whether secret posts"),
      parent_comment_no: z.number().int().min(1).optional().describe("parent comment number"),
      input_channel: z.enum(["P", "M"]).default("P").describe("Types of online stores"),
      created_date: z.string().optional().describe("date of create"),
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

export const BoardCommentDeleteSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("board number"),
    article_no: z.number().int().describe("posts number"),
    comment_no: z.number().int().describe("Comment number"),
  })
  .strict();

export type BoardAllCommentsSearchParams = z.infer<typeof BoardAllCommentsSearchParamsSchema>;
export type BoardCommentsSearchParams = z.infer<typeof BoardCommentsSearchParamsSchema>;
export type BoardCommentCreateInput = z.infer<typeof BoardCommentCreateSchema>;
export type BoardCommentDeleteInput = z.infer<typeof BoardCommentDeleteSchema>;
