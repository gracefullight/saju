import { z } from "zod";

export const CategoryPropertySchema = z.object({
  key: z.string().describe("Property key (e.g., product_name)"),
  name: z.string().optional().describe("Property name text"),
  display: z.enum(["T", "F"]).optional().describe("Display property"),
  display_name: z.enum(["T", "F"]).optional().describe("Display property name"),
  font_type: z
    .enum(["N", "B", "I", "D"])
    .optional()
    .describe("Font type (N: Normal, B: Bold, I: Italic, D: Bold Italic)"),
  font_size: z.number().int().optional().describe("Font size"),
  font_color: z.string().optional().describe("Font color"),
});

export const ListCategoryPropertiesSchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
    display_group: z
      .number()
      .int()
      .min(1)
      .max(3)
      .optional()
      .default(1)
      .describe("Display group (1: Normal, 2: Recommendation, 3: New)"),
    separated_category: z
      .enum(["T", "F"])
      .optional()
      .default("F")
      .describe("Start separately by category"),
    category_no: z.number().int().optional().describe("Category number"),
  })
  .strict();

export const CreateCategoryPropertySchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
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

export const UpdateCategoryPropertiesSchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
    display_group: z
      .number()
      .int()
      .min(1)
      .max(3)
      .describe("Display group (1: Normal, 2: Recommendation, 3: New)"),
    separated_category: z
      .enum(["T", "F"])
      .optional()
      .default("F")
      .describe("Start separately by category"),
    category_no: z.number().int().optional().describe("Category number"),
    properties: z.array(CategoryPropertySchema).describe("List of properties to update"),
  })
  .strict();

export type CategoryProperty = z.infer<typeof CategoryPropertySchema>;
export type ListCategoryProperties = z.infer<typeof ListCategoryPropertiesSchema>;
export type CreateCategoryProperty = z.infer<typeof CreateCategoryPropertySchema>;
export type UpdateCategoryProperties = z.infer<typeof UpdateCategoryPropertiesSchema>;
