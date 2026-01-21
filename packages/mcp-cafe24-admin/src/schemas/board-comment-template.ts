import { z } from "zod";

export const BoardCommentTemplatesSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_type: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe(
        "Board category (1: admin, 2: general, 3: resources, 4: others, 5: product, 6: photo, 7: My inquiries, 11: memo)",
      ),
    title: z.string().max(100).optional().describe("Title of frequently used answer"),
    since_comment_no: z
      .number()
      .int()
      .min(1)
      .max(2147483647)
      .optional()
      .describe("Frequently Used Answer No."),
    limit: z.number().int().min(1).max(100).default(10).describe("Limit"),
  })
  .strict();

export const BoardCommentTemplateDetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    comment_no: z.number().int().min(1).describe("Frequently Used Answer No."),
  })
  .strict();

export const BoardCommentTemplateCreateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    request: z.object({
      title: z.string().max(256).describe("Title of frequently used answer"),
      content: z.string().max(4000).describe("Content of frequently used answer"),
      board_type: z.number().int().min(1).describe("Board category"),
    }),
  })
  .strict();

export const BoardCommentTemplateUpdateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    comment_no: z.number().int().min(1).describe("Frequently Used Answer No."),
    request: z.object({
      title: z.string().max(256).optional().describe("Title of frequently used answer"),
      content: z.string().max(4000).optional().describe("Content of frequently used answer"),
      board_type: z.number().int().min(1).optional().describe("Board category"),
    }),
  })
  .strict();

export const BoardCommentTemplateDeleteSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    comment_no: z.number().int().min(1).describe("Frequently Used Answer No."),
  })
  .strict();

export type BoardCommentTemplatesSearchParams = z.infer<
  typeof BoardCommentTemplatesSearchParamsSchema
>;
export type BoardCommentTemplateDetailParams = z.infer<
  typeof BoardCommentTemplateDetailParamsSchema
>;
export type BoardCommentTemplateCreateInput = z.infer<typeof BoardCommentTemplateCreateSchema>;
export type BoardCommentTemplateUpdateInput = z.infer<typeof BoardCommentTemplateUpdateSchema>;
export type BoardCommentTemplateDeleteInput = z.infer<typeof BoardCommentTemplateDeleteSchema>;
