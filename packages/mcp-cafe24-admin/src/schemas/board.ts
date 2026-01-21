import { z } from "zod";

export const BoardsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    board_no: z.number().optional().describe("Filter by board number"),
  })
  .strict();

export const BoardDetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("Board number"),
  })
  .strict();

export const BoardUpdateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    board_no: z.number().int().describe("Board number"),
    request: z.object({
      use_board: z.enum(["T", "F"]).optional().describe("Whether to use board"),
      use_display: z.enum(["T", "F"]).optional().describe("Whether to display"),
      use_top_image: z.enum(["T", "F"]).optional().describe("Enable header image"),
      top_image_url: z.string().url().optional().describe("Header image path"),
      attached_file: z.enum(["T", "F"]).optional().describe("Whether to use file attachments"),
      attached_file_size_limit: z
        .number()
        .int()
        .min(1)
        .max(10485760)
        .optional()
        .describe("Maximum file attachment size (byte)"),
      use_category: z.enum(["T", "F"]).optional().describe("Category feature enabled"),
      categories: z
        .array(
          z.object({
            id: z.number().int().describe("Category ID"),
            name: z.string().describe("Category name"),
          }),
        )
        .optional()
        .describe("Category information"),
      secret_only: z.enum(["T", "F"]).optional().describe("Private posts only"),
      admin_confirm: z.enum(["T", "F"]).optional().describe("Admin verification enabled"),
      comment_author_display: z
        .enum(["N", "U", "I"])
        .optional()
        .describe("Display comment author by"),
      comment_author_protection: z
        .object({
          is_use: z.enum(["T", "F"]),
          author_name_type: z.string().optional(),
          partial_character_display: z.union([z.number(), z.string()]),
          alternative_text_display: z.string(),
        })
        .optional(),
      spam_auto_prevention: z
        .object({
          apply_scope: z.array(z.enum(["post_actions", "comment"])),
          member_scope: z.enum(["A", "N"]),
        })
        .optional(),
      reply_feature: z.enum(["T", "F"]).optional().describe("Enable answer posting"),
      write_permission: z
        .enum(["A", "V", "I", "N", "G"])
        .optional()
        .describe("Permission to write"),
      write_member_group_no: z
        .array(z.number())
        .optional()
        .describe("Member groups with write permission"),
      write_permission_extra: z
        .object({
          is_member_buy: z.enum(["T", "F"]).nullable(),
          member_write_after: z.string().nullable(),
          use_member_write_period: z.enum(["T", "F"]).nullable(),
          member_write_period: z.number().nullable(),
          is_guest_buy: z.enum(["T", "F"]).nullable(),
          guest_write_after: z.string().nullable(),
          use_guest_write_period: z.enum(["T", "F"]).nullable(),
          guest_write_period: z.number().nullable(),
          product_info_option: z.enum(["T", "F"]).nullable(),
          post_length_limit: z.enum(["T", "F"]).nullable(),
          post_min_length: z.number().nullable(),
          post_editable: z.enum(["T", "F"]).nullable(),
        })
        .optional(),
      reply_permission: z.enum(["A", "M", "N", "G"]).optional().describe("Permission to reply"),
      reply_member_group_no: z
        .array(z.number())
        .optional()
        .describe("Member groups with reply permission"),
      author_display: z.enum(["N", "U", "I"]).optional().describe("Display author by"),
      author_protection: z
        .object({
          is_use: z.enum(["T", "F"]),
          author_name_type: z.string().optional(),
          partial_character_display: z.union([z.number(), z.string()]),
          alternative_text_display: z.string(),
        })
        .optional(),
      board_guide: z.string().optional().describe("Board description"),
      admin_title_fixed: z
        .object({
          is_use: z.enum(["T", "F"]),
          admin_title_list: z.array(z.string()).optional(),
          staff_skip_post_title: z.enum(["T", "F"]).optional(),
        })
        .optional(),
      admin_reply_fixed: z
        .object({
          is_use: z.enum(["T", "F"]),
          admin_reply_list: z.array(z.string()).optional(),
          staff_skip_reply_title: z.enum(["T", "F"]).optional(),
        })
        .optional(),
      input_form: z
        .object({
          is_use: z.enum(["T", "F"]),
          input_form_title: z.array(z.string()),
          enable_input_form_title: z.array(z.enum(["T", "F"])),
        })
        .optional(),
      page_size: z.number().int().min(1).max(99).optional().describe("Posts per page"),
      product_page_size: z
        .number()
        .int()
        .min(5)
        .max(999)
        .optional()
        .describe("Posts per page (Product)"),
      page_display_count: z.number().int().min(1).max(99).optional().describe("Number of pages"),
      use_comment: z.enum(["T", "F"]).optional().describe("Enable comment feature"),
      board_name: z.string().min(1).max(50).optional().describe("Board name"),
      board_type: z.number().int().optional().describe("Board category (1, 2, 5)"),
      article_display_type: z.enum(["A", "T", "F"]).optional().describe("Whether to display posts"),
    }),
  })
  .strict();

export const BoardSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const SpamAutoPreventionSchema = z
  .object({
    type: z.enum(["S", "R"]).describe("Spam prevention type: S=Security code, R=Google reCAPTCHA"),
    site_key: z.string().optional().describe("Google reCAPTCHA site key (required for type R)"),
    secret_key: z.string().optional().describe("Google reCAPTCHA secret key (required for type R)"),
  })
  .strict();

export const BoardSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    admin_name: z
      .enum(["name", "nickname", "shopname", "storename"])
      .optional()
      .describe("Board admin name: name, nickname, shopname, storename"),
    password_rules: z.enum(["T", "F"]).optional().describe("Password rules: T=Enable, F=Disable"),
    linked_board: z
      .union([z.literal("F"), z.number()])
      .optional()
      .describe("Linked board: F=Disabled, or board number"),
    review_button_mode: z
      .enum(["all", "shipbegin_date", "shipend_date"])
      .optional()
      .describe("Review button display: all, shipbegin_date, shipend_date"),
    spam_auto_prevention: SpamAutoPreventionSchema.optional().describe("Spam prevention settings"),
  })
  .strict();

export type BoardUpdateInput = z.infer<typeof BoardUpdateSchema>;
export type BoardsSearchParams = z.infer<typeof BoardsSearchParamsSchema>;
export type BoardDetailParams = z.infer<typeof BoardDetailParamsSchema>;
export type BoardSettingParams = z.infer<typeof BoardSettingParamsSchema>;
export type BoardSettingUpdateParams = z.infer<typeof BoardSettingUpdateParamsSchema>;
