import { z } from "zod";

export const InformationParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const InformationItemSchema = z
  .object({
    type: z
      .enum([
        "JOIN",
        "ORDER",
        "PAYMENT",
        "SHIPPING",
        "EXCHANGE",
        "REFUND",
        "POINT",
        "SHIPPING_INFORMATION",
      ])
      .describe(
        "Information type: JOIN, ORDER, PAYMENT, SHIPPING, EXCHANGE, REFUND, POINT, SHIPPING_INFORMATION",
      ),
    display_mobile: z.enum(["T", "F"]).optional().describe("Display on mobile: T=Yes, F=No"),
    use: z.enum(["T", "F"]).optional().describe("Enable T=Yes, F=No"),
    save_type: z.enum(["S", "C"]).optional().describe("Save type: S=Standard, C=Custom"),
    content: z.string().optional().describe("Information content"),
  })
  .strict();

export const InformationUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    requests: z
      .array(InformationItemSchema)
      .min(1)
      .describe("Array of information items to update"),
  })
  .strict();

export type InformationParams = z.infer<typeof InformationParamsSchema>;
export type InformationItem = z.infer<typeof InformationItemSchema>;
export type InformationUpdateParams = z.infer<typeof InformationUpdateParamsSchema>;
