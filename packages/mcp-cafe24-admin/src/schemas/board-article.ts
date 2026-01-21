import { z } from "zod";

export const BoardArticlesSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("Board number"),
    board_category_no: z.number().int().optional().describe("Category number of a board"),
    start_date: z.string().optional().describe("Search start date (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("Search end date (YYYY-MM-DD)"),
    input_channel: z.enum(["P", "M"]).optional().describe("Types of online stores: P=PC, M=Mobile"),
    search: z
      .enum(["subject", "content", "writer_name", "product", "member_id"])
      .optional()
      .describe("Search scope"),
    keyword: z.string().optional().describe("Search keyword"),
    reply_status: z
      .enum(["N", "P", "C"])
      .optional()
      .describe("Answered status: N=Unanswered, P=Processing, C=Completed"),
    comment: z.enum(["T", "F"]).optional().describe("Comments filter"),
    attached_file: z.enum(["T", "F"]).optional().describe("Attachment filter"),
    article_type: z
      .string()
      .optional()
      .describe("Type of post (all, normal, notice, fixed). comma-separated"),
    product_no: z.number().int().optional().describe("Product number"),
    has_product: z.enum(["T", "F"]).optional().describe("Include product information"),
    is_notice: z.enum(["T", "F"]).optional().describe("Whether notice"),
    is_display: z.enum(["T", "F"]).optional().describe("Post publishing settings"),
    supplier_id: z.string().min(4).max(16).optional().describe("Supplier ID"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Offset"),
    limit: z.number().int().min(1).max(100).default(10).describe("Limit"),
  })
  .strict();

export const BoardArticleCreateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("Board number"),
    requests: z.array(
      z.object({
        writer: z.string().max(100).describe("Writer"),
        title: z.string().max(256).describe("Subject"),
        content: z.string().describe("Content"),
        client_ip: z.string().describe("IP address of a writer"),
        reply_article_no: z.number().int().optional().describe("Replied post number"),
        created_date: z.string().optional().describe("Date of create"),
        writer_email: z.string().email().optional().describe("Email of writer"),
        member_id: z.string().max(20).optional().describe("Member ID"),
        notice: z.enum(["T", "F"]).default("F").describe("Whether notice"),
        fixed: z.enum(["T", "F"]).default("F").describe("Whether fixed"),
        deleted: z.enum(["T", "F", "B"]).default("F").describe("Whether deleted"),
        reply: z.enum(["T", "F"]).default("F").describe("Whether replied"),
        rating: z.number().int().min(1).max(5).optional().describe("Review score"),
        sales_channel: z.string().max(20).optional().describe("Sales channel"),
        secret: z.enum(["T", "F"]).default("F").describe("Whether secret posts"),
        password: z.string().optional().describe("Password of posts"),
        reply_mail: z.enum(["Y", "N"]).default("N").describe("Whether replied by mail"),
        board_category_no: z.number().int().optional().describe("Board category number"),
        nick_name: z.string().max(50).optional().describe("Nickname"),
        input_channel: z.enum(["P", "M"]).default("P").describe("Posting path"),
        reply_user_id: z.string().optional().describe("Manager ID"),
        reply_status: z.enum(["N", "P", "C"]).optional().describe("Status of replay"),
        product_no: z.number().int().optional().describe("Product number"),
        category_no: z.number().int().optional().describe("Category number"),
        order_id: z.string().optional().describe("Order ID"),
        naverpay_review_id: z.string().optional().describe("Naver Pay review ID"),
        attach_file_urls: z
          .array(
            z.object({
              name: z.string(),
              url: z.string().url(),
            }),
          )
          .optional()
          .describe("Attached files"),
      }),
    ),
  })
  .strict();

export const BoardArticleUpdateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("Board number"),
    article_no: z.number().int().describe("Post number"),
    request: z.object({
      title: z.string().max(256).optional().describe("Subject"),
      content: z.string().optional().describe("Content"),
      rating: z.number().int().min(1).max(5).optional().describe("Review score"),
      sales_channel: z.string().max(20).optional().describe("Sales channel"),
      board_category_no: z.number().int().optional().describe("Board category number"),
      display: z.enum(["T", "F"]).optional().describe("Publish settings"),
      notice: z.enum(["T", "F"]).optional().describe("Search notice"),
      fixed: z.enum(["T", "F"]).optional().describe("Search fixed"),
      display_time_start_hour: z
        .union([z.number(), z.string()])
        .optional()
        .describe("Exposure start hour"),
      display_time_end_hour: z
        .union([z.number(), z.string()])
        .optional()
        .describe("Exposure end hour"),
      attach_file_url1: z.string().url().optional().describe("Attached file URL 1"),
      attach_file_url2: z.string().url().optional().describe("Attached file URL 2"),
      attach_file_url3: z.string().url().optional().describe("Attached file URL 3"),
      attach_file_url4: z.string().url().optional().describe("Attached file URL 4"),
      attach_file_url5: z.string().url().optional().describe("Attached file URL 5"),
    }),
  })
  .strict();

export const BoardArticleDeleteSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("Board number"),
    article_no: z.number().int().describe("Post number"),
  })
  .strict();

export type BoardArticlesSearchParams = z.infer<typeof BoardArticlesSearchParamsSchema>;
export type BoardArticleCreateInput = z.infer<typeof BoardArticleCreateSchema>;
export type BoardArticleUpdateInput = z.infer<typeof BoardArticleUpdateSchema>;
export type BoardArticleDeleteInput = z.infer<typeof BoardArticleDeleteSchema>;
