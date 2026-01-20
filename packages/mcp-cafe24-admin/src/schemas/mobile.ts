import { z } from "zod";

export const MobileSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const MobileSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use_mobile_page: z.enum(["T", "F"]).describe("Enable mobile page: T=Yes, F=No"),
  })
  .strict();

export type MobileSettingParams = z.infer<typeof MobileSettingParamsSchema>;
export type MobileSettingUpdateParams = z.infer<typeof MobileSettingUpdateParamsSchema>;
