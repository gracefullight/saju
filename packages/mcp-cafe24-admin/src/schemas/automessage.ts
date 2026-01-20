import { z } from "zod";

export const AutomessageArgumentsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const AutomessageSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const AutomessageSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    send_method: z
      .enum(["S", "K"])
      .describe("Auto message send method: S=SMS, K=KakaoAlimtalk (fallback to SMS on failure)"),
    send_method_push: z
      .enum(["T", "F"])
      .optional()
      .describe("Send push first to push recipients: T=Yes, F=No"),
  })
  .strict();

export type AutomessageArgumentsParams = z.infer<typeof AutomessageArgumentsParamsSchema>;
export type AutomessageSettingParams = z.infer<typeof AutomessageSettingParamsSchema>;
export type AutomessageSettingUpdateParams = z.infer<typeof AutomessageSettingUpdateParamsSchema>;
