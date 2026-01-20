import { z } from "zod";

export const PointsSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const PointsSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    point_issuance_standard: z
      .enum(["C", "P"])
      .optional()
      .describe("Point issuance standard: C=After Delivery, P=After Purchase Confirmation"),
    payment_period: z
      .number()
      .int()
      .optional()
      .describe("Payment period (days): 0, 1, 3, 7, 14, 20 depending on standard"),
    name: z.string().optional().describe("Point name (e.g., Mileage)"),
    format: z.string().optional().describe("Point display format (e.g., $[:PRICE:])"),
    round_unit: z
      .enum(["F", "0.01", "0.1", "1", "10", "100", "1000"])
      .optional()
      .describe("Rounding unit: F=None, or specific unit"),
    round_type: z
      .enum(["A", "B", "C"])
      .optional()
      .describe("Rounding type: A=Down, B=Half-up, C=Up"),
    display_type: z
      .enum(["P", "W", "WP", "PW"])
      .optional()
      .describe("Display type: P=Rate, W=Amount, WP=Amount/Rate, PW=Rate/Amount"),
    unusable_points_change_type: z
      .enum(["M", "T"])
      .optional()
      .describe("Unusable points conversion: M=First date, T=Last date"),
    join_point: z.string().optional().describe("Join point amount"),
    use_email_agree_point: z
      .enum(["T", "F"])
      .optional()
      .describe("Points for email consent: T=Yes, F=No"),
    use_sms_agree_point: z
      .enum(["T", "F"])
      .optional()
      .describe("Points for SMS consent: T=Yes, F=No"),
    agree_change_type: z
      .enum(["T", "F", "P"])
      .optional()
      .describe("Consent change type: T=Possible, F=Impossible, P=Period restricted"),
    agree_restriction_period: z
      .number()
      .int()
      .optional()
      .describe("Restriction period (months): 1, 3, 6, 12"),
    agree_point: z.string().optional().describe("Consent point amount"),
  })
  .strict();

export type PointsSettingParams = z.infer<typeof PointsSettingParamsSchema>;
export type PointsSettingUpdateParams = z.infer<typeof PointsSettingUpdateParamsSchema>;
