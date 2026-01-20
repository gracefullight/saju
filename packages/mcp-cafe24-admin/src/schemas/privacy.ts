import { z } from "zod";

export const PrivacyJoinParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const PrivacyJoinUpdateItemSchema = z
  .object({
    no: z.number().int().min(1).describe("Agreement ID number"),
    use: z.enum(["T", "F"]).optional().describe("Enable agreement: T=Yes, F=No"),
    required: z.enum(["T", "F"]).optional().describe("Is required: T=Yes, F=No"),
    display: z
      .array(z.enum(["JOIN", "SIMPLE_ORDER_JOIN", "SHOPPING_PAY_EASY_JOIN"]))
      .optional()
      .describe(
        "Display screens: JOIN=Signup, SIMPLE_ORDER_JOIN=Order Simple Signup, SHOPPING_PAY_EASY_JOIN=Shopping Pay Easy Signup",
      ),
    save_type: z.enum(["S", "C"]).optional().describe("Save type: S=Standard, C=Custom"),
    content: z.string().optional().describe("Agreement content"),
  })
  .strict();

export const PrivacyJoinUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    requests: z.array(PrivacyJoinUpdateItemSchema).min(1).describe("List of agreements to update"),
  })
  .strict();

export type PrivacyJoinParams = z.infer<typeof PrivacyJoinParamsSchema>;
export type PrivacyJoinUpdateItem = z.infer<typeof PrivacyJoinUpdateItemSchema>;
export type PrivacyJoinUpdateParams = z.infer<typeof PrivacyJoinUpdateParamsSchema>;
