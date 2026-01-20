import { z } from "zod";

/**
 * Schema for listing product variants
 */
export const ProductVariantsListParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    embed: z
      .array(z.enum(["inventories"]))
      .optional()
      .describe("Embed inventories resource"),
  })
  .strict();

export type ProductVariantsListParams = z.infer<typeof ProductVariantsListParamsSchema>;

/**
 * Schema for getting a single product variant
 */
export const ProductVariantGetParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    variant_code: z
      .string()
      .regex(/^[A-Z0-9]{12}$/)
      .describe("Variant code (12 characters, A-Z0-9)"),
    embed: z
      .array(z.enum(["inventories"]))
      .optional()
      .describe("Embed inventories resource"),
  })
  .strict();

export type ProductVariantGetParams = z.infer<typeof ProductVariantGetParamsSchema>;

/**
 * Schema for updating a single product variant
 */
export const ProductVariantUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    variant_code: z
      .string()
      .regex(/^[A-Z0-9]{12}$/)
      .describe("Variant code (12 characters, A-Z0-9)"),
    custom_variant_code: z
      .string()
      .max(40)
      .optional()
      .describe("Custom variant code (max 40 characters)"),
    display: z
      .enum(["T", "F"])
      .optional()
      .describe("Display status (T: Display, F: Do not display)"),
    selling: z.enum(["T", "F"]).optional().describe("Selling status (T: Sell, F: Do not sell)"),
    additional_amount: z
      .number()
      .min(-2147483647)
      .max(2147483647)
      .optional()
      .describe("Additional price for the variant"),
    quantity: z.number().int().optional().describe("Available inventory quantity"),
    use_inventory: z.enum(["T", "F"]).optional().describe("Use inventory (T: Use, F: Do not use)"),
    important_inventory: z
      .enum(["A", "B"])
      .optional()
      .describe("Important inventory (A: General, B: Important)"),
    inventory_control_type: z
      .enum(["A", "B"])
      .optional()
      .describe("Inventory check criteria (A: Upon order, B: Upon payment)"),
    display_soldout: z
      .enum(["T", "F"])
      .optional()
      .describe("Display out-of-stock icon (T: Display, F: Do not display)"),
    safety_inventory: z.number().int().optional().describe("Minimum stock level"),
  })
  .strict();

export type ProductVariantUpdateParams = z.infer<typeof ProductVariantUpdateParamsSchema>;

/**
 * Schema for a single variant in bulk update
 */
const VariantBulkUpdateItemSchema = z.object({
  variant_code: z
    .string()
    .regex(/^[A-Z0-9]{12}$/)
    .describe("Variant code (12 characters, A-Z0-9)"),
  custom_variant_code: z.string().max(40).optional().describe("Custom variant code"),
  display: z.enum(["T", "F"]).optional().describe("Display status"),
  selling: z.enum(["T", "F"]).optional().describe("Selling status"),
  additional_amount: z.number().optional().describe("Additional price"),
  quantity: z.number().int().optional().describe("Available inventory"),
  use_inventory: z.enum(["T", "F"]).optional().describe("Use inventory"),
  important_inventory: z.enum(["A", "B"]).optional().describe("Important inventory"),
  inventory_control_type: z.enum(["A", "B"]).optional().describe("Inventory check criteria"),
  display_soldout: z.enum(["T", "F"]).optional().describe("Display out-of-stock icon"),
  safety_inventory: z.number().int().optional().describe("Minimum stock level"),
});

/**
 * Schema for bulk updating product variants
 */
export const ProductVariantsBulkUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    requests: z.array(VariantBulkUpdateItemSchema).min(1).describe("Array of variants to update"),
  })
  .strict();

export type ProductVariantsBulkUpdateParams = z.infer<typeof ProductVariantsBulkUpdateParamsSchema>;

/**
 * Schema for deleting a product variant
 */
export const ProductVariantDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    variant_code: z
      .string()
      .regex(/^[A-Z0-9]{12}$/)
      .describe("Variant code (12 characters, A-Z0-9)"),
  })
  .strict();

export type ProductVariantDeleteParams = z.infer<typeof ProductVariantDeleteParamsSchema>;
