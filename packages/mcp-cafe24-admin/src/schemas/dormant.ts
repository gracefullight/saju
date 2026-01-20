import { z } from "zod";

export const DormantAccountParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const DormantAccountUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use: z.enum(["T", "F"]).optional().describe("Enable dormant account feature: T=Yes, F=No"),
    notice_send_automatic: z
      .enum(["T", "F"])
      .optional()
      .describe("Auto send dormant notice: T=Yes, F=No"),
    send_sms: z.enum(["T", "F"]).optional().describe("Send notice via SMS/KakaoTalk: T=Yes, F=No"),
    send_email: z.enum(["T", "F"]).optional().describe("Send notice via email: T=Yes, F=No"),
    point_extinction: z
      .enum(["T", "F"])
      .optional()
      .describe("Expire dormant member points: T=Yes, F=No"),
  })
  .strict();

export type DormantAccountParams = z.infer<typeof DormantAccountParamsSchema>;
export type DormantAccountUpdateParams = z.infer<typeof DormantAccountUpdateParamsSchema>;
