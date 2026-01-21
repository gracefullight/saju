import { z } from "zod";

export const DiscountCodesSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    discount_code_name: z.string().optional().describe("Discount code name"),
    discount_code: z.string().optional().describe("Discount code"),
    search_date_type: z
      .enum(["available_start_date", "available_end_date", "created_date"])
      .optional()
      .describe("Search date type"),
    start_date: z.string().optional().describe("Search start date (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("Search end date (YYYY-MM-DD)"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location of list"),
    limit: z.number().int().min(1).max(100).default(10).describe("Limit"),
    sort: z
      .enum([
        "discount_code_name",
        "discount_code",
        "created_date",
        "available_start_date",
        "available_end_date",
      ])
      .default("created_date")
      .describe("Sort order"),
    order: z.enum(["asc", "desc"]).default("desc").describe("Order by"),
  })
  .strict();

export const DiscountCodeDetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    discount_code_no: z.number().int().min(1).describe("Discount code number"),
  })
  .strict();

export const DiscountCodeCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    request: z
      .object({
        discount_code: z.string().min(1).max(35).describe("Discount code"),
        discount_code_name: z.string().min(1).max(50).describe("Discount code name"),
        discount_value: z.number().int().min(1).max(99).describe("Discounted amount"),
        discount_truncation_unit: z
          .enum(["C", "B", "F", "O", "T", "M", "H"])
          .describe("Rounding unit"),
        discount_max_price: z
          .number()
          .int()
          .min(1)
          .max(999999999)
          .describe("Maximum discount amount"),
        available_start_date: z.string().describe("Start date"),
        available_end_date: z.string().describe("End date"),
        available_product_type: z
          .enum(["A", "P", "C"])
          .default("A")
          .describe("Available product type"),
        available_product: z
          .array(z.number())
          .nullable()
          .optional()
          .describe("Specific product list"),
        available_category: z
          .array(z.number())
          .nullable()
          .optional()
          .describe("Specific category list"),
        available_min_price: z
          .number()
          .int()
          .max(999999999)
          .default(0)
          .describe("Minimum order amount"),
        available_issue_count: z.number().int().max(10000).default(0).describe("Maximum issuances"),
        available_user: z.enum(["M", "A"]).default("A").describe("Applicable to"),
        max_usage_per_user: z.number().int().max(999).default(0).describe("Usage per customer"),
      })
      .strict()
      .describe("Discount code creation payload"),
  })
  .strict();

export const DiscountCodeUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    discount_code_no: z.number().int().min(1).describe("Discount code number"),
    request: z
      .object({
        discount_code: z.string().min(1).max(35).optional().describe("Discount code"),
        discount_code_name: z.string().min(1).max(50).optional().describe("Discount code name"),
        discount_value: z.number().int().min(1).max(99).optional().describe("Discounted amount"),
        discount_truncation_unit: z
          .enum(["C", "B", "F", "O", "T", "M", "H"])
          .optional()
          .describe("Rounding unit"),
        discount_max_price: z
          .number()
          .int()
          .min(1)
          .max(999999999)
          .optional()
          .describe("Maximum discount amount"),
        available_start_date: z.string().optional().describe("Start date"),
        available_end_date: z.string().optional().describe("End date"),
        available_product_type: z
          .enum(["A", "P", "C"])
          .optional()
          .describe("Available product type"),
        available_product: z
          .array(z.number())
          .nullable()
          .optional()
          .describe("Specific product list"),
        available_category: z
          .array(z.number())
          .nullable()
          .optional()
          .describe("Specific category list"),
        available_min_price: z
          .number()
          .int()
          .max(999999999)
          .optional()
          .describe("Minimum order amount"),
        available_issue_count: z.number().int().max(10000).optional().describe("Maximum issuances"),
        available_user: z.enum(["M", "A"]).optional().describe("Applicable to"),
        max_usage_per_user: z.number().int().max(999).optional().describe("Usage per customer"),
      })
      .strict()
      .describe("Discount code update payload"),
  })
  .strict();

export const DiscountCodeDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    discount_code_no: z.number().int().min(1).describe("Discount code number"),
  })
  .strict();

export type DiscountCodesSearchParams = z.infer<typeof DiscountCodesSearchParamsSchema>;
export type DiscountCodeDetailParams = z.infer<typeof DiscountCodeDetailParamsSchema>;
export type DiscountCodeCreateParams = z.infer<typeof DiscountCodeCreateParamsSchema>;
export type DiscountCodeUpdateParams = z.infer<typeof DiscountCodeUpdateParamsSchema>;
export type DiscountCodeDeleteParams = z.infer<typeof DiscountCodeDeleteParamsSchema>;
