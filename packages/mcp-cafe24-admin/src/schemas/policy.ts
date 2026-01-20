import { z } from "zod";

export const PolicyParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const PolicyUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    save_type: z
      .enum(["S", "C"])
      .optional()
      .default("S")
      .describe("Save type: S=Standard, C=Custom (Default: S)"),
    privacy_all: z.string().optional().describe("Privacy policy full text"),
    terms_using_mall: z.string().optional().describe("Terms of use"),
    use_privacy_join: z
      .enum(["T", "F"])
      .optional()
      .describe("Enable privacy policy display at signup: T=Yes, F=No"),
    privacy_join: z.string().optional().describe("Privacy policy text for signup"),
    use_withdrawal: z.enum(["T", "F"]).optional().describe("Enable withdrawal policy: T=Yes, F=No"),
    required_withdrawal: z
      .enum(["T", "F"])
      .optional()
      .describe("Require withdrawal policy agreement: T=Yes, F=No"),
    withdrawal: z.string().optional().describe("Withdrawal policy text"),
  })
  .strict();

export type PolicyParams = z.infer<typeof PolicyParamsSchema>;
export type PolicyUpdateParams = z.infer<typeof PolicyUpdateParamsSchema>;
