import { z } from "zod";

export const BoardsSearchParamsSchema = z
  .object({
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
    board_no: z.number().describe("Board number"),
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

export type BoardsSearchParams = z.infer<typeof BoardsSearchParamsSchema>;
export type BoardDetailParams = z.infer<typeof BoardDetailParamsSchema>;
export type BoardSettingParams = z.infer<typeof BoardSettingParamsSchema>;
export type SpamAutoPrevention = z.infer<typeof SpamAutoPreventionSchema>;
export type BoardSettingUpdateParams = z.infer<typeof BoardSettingUpdateParamsSchema>;
