import { z } from "zod";

export const MainPropertyParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number"),
    display_group: z.number().int().min(2).optional().describe("Main display group number"),
  })
  .strict();

export const MainPropertyCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number"),
    multishop_display_names: z
      .array(
        z.object({
          shop_no: z.number().int(),
          name: z.string(),
        }),
      )
      .min(1)
      .describe("Display names for multiple shops"),
    display: z.enum(["T", "F"]).optional().default("F").describe("Display property"),
    display_name: z.enum(["T", "F"]).optional().default("T").describe("Display property name"),
    font_type: z
      .enum(["N", "B", "I", "D"])
      .optional()
      .default("N")
      .describe("Font type (N: Normal, B: Bold, I: Italic, D: Bold Italic)"),
    font_size: z.number().int().optional().default(12).describe("Font size"),
    font_color: z.string().optional().default("#555555").describe("Font color"),
    exposure_group_type: z
      .enum(["A", "M"])
      .optional()
      .default("A")
      .describe("Exposure group type (A: All, M: Member)"),
  })
  .strict();

export const MainPropertiesUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number"),
    display_group: z.number().int().min(2).describe("Main display group number"),
    properties: z.array(z.object({})).describe("List of properties to update"),
  })
  .strict();

export const MainSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const TextStyleSchema = z
  .object({
    use: z.enum(["T", "F"]).optional().describe("Use T=Yes, F=No"),
    color: z.string().optional().describe("Font color (e.g., #000000)"),
    font_size: z.union([z.number(), z.string()]).optional().describe("Font size (in pixels)"),
    font_type: z
      .enum(["N", "B", "I", "D"])
      .optional()
      .describe("Font type: N=Normal, B=Bold, I=Italic, D=Bold Italic"),
  })
  .strict();

export const MainSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    strikethrough_retail_price: z
      .enum(["T", "F"])
      .optional()
      .describe("Strikethrough retail price: T=Yes, F=No"),
    strikethrough_price: z.enum(["T", "F"]).optional().describe("Strikethrough price: T=Yes, F=No"),
    product_tax_type_text: TextStyleSchema.optional().describe("Tax type display settings"),
    product_discount_price_text: TextStyleSchema.optional().describe(
      "Discount price display settings",
    ),
    optimum_discount_price_text: TextStyleSchema.optional().describe(
      "Optimum discount price display settings",
    ),
  })
  .strict();

export type MainProperty = z.infer<typeof MainPropertyParamsSchema>;
export type ListMainProperties = z.infer<typeof MainPropertyParamsSchema>;
export type CreateMainProperty = z.infer<typeof MainPropertyCreateParamsSchema>;
export type UpdateMainProperties = z.infer<typeof MainPropertiesUpdateParamsSchema>;
export type MainSettingParams = z.infer<typeof MainSettingParamsSchema>;
export type TextStyle = z.infer<typeof TextStyleSchema>;
export type MainSettingUpdateParams = z.infer<typeof MainSettingUpdateParamsSchema>;
