import { z } from "zod";

export const SerialCouponsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    coupon_no: z.string().optional().describe("Coupon number"),
    coupon_name: z.string().optional().describe("Coupon name"),
    benefit_type: z
      .string()
      .optional()
      .describe("Benefit type (comma-separated: A, B, C, D, E, I, H, J, F, G)"),
    issued_flag: z.enum(["T", "F"]).optional().describe("Issued flag"),
    created_start_date: z.string().optional().describe("Search start date (YYYY-MM-DD)"),
    created_end_date: z.string().optional().describe("Search end date (YYYY-MM-DD)"),
    deleted: z.string().default("F").optional().describe("Whether coupon is deleted (T, F)"),
    issue_order_path: z.enum(["W", "M", "P"]).optional().describe("Available order path (W, M, P)"),
    issue_order_type: z.enum(["P", "O"]).optional().describe("Issue unit (P, O)"),
    issue_reserved: z.enum(["T", "F"]).optional().describe("Issue reservation"),
    available_period_type: z
      .string()
      .optional()
      .describe("Available date type (comma-separated: F, R, M)"),
    available_datetime: z
      .string()
      .optional()
      .describe("Available datetime (valid for period type F)"),
    available_site: z.enum(["W", "M", "P"]).optional().describe("Available site (W, M, P)"),
    available_scope: z.enum(["P", "O"]).optional().describe("Available scope (P, O)"),
    available_price_type: z.enum(["U", "O", "P"]).optional().describe("Available price type"),
    available_order_price_type: z
      .enum(["U", "I"])
      .optional()
      .describe("Minimum purchase amount basis (U, I)"),
    limit: z.number().int().min(1).max(500).default(100).describe("Limit"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location of list"),
  })
  .strict();

export const SerialCouponCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    request: z
      .object({
        coupon_name: z.string().min(1).max(50).describe("Coupon name"),
        benefit_type: z.enum(["A", "B"]).describe("Benefit type"),
        available_period_type: z.enum(["F", "R", "M"]).describe("Available date type"),
        available_begin_datetime: z.string().optional().describe("Available start date"),
        available_end_datetime: z.string().optional().describe("Available end date"),
        available_day_from_issued: z
          .number()
          .int()
          .min(1)
          .max(999)
          .optional()
          .describe("Available day"),
        available_site: z.array(z.enum(["W", "M", "P"])).describe("Available Site"),
        available_scope: z.enum(["P", "O"]).describe("Available scope"),
        available_product: z.enum(["U", "I", "E"]).describe("Applicable product"),
        available_product_list: z
          .array(z.number())
          .optional()
          .describe("List of coupon-applied products"),
        available_category: z.enum(["U", "I", "E"]).describe("Applicable category"),
        available_category_list: z
          .array(z.number())
          .optional()
          .describe("List of coupon-applied categories"),
        available_amount_type: z.enum(["E", "I"]).describe("Available amount type"),
        available_coupon_count_by_order: z
          .number()
          .int()
          .min(1)
          .max(999)
          .describe("Max number per order"),
        available_price_type: z
          .enum(["U", "O", "P"])
          .default("U")
          .optional()
          .describe("Available price type"),
        available_order_price_type: z
          .enum(["U", "I"])
          .optional()
          .describe("Minimum purchase amount basis"),
        available_min_price: z.string().optional().describe("Available price"),
        discount_amount: z
          .object({
            benefit_price: z.string().describe("Benefit amount"),
          })
          .strict()
          .optional()
          .describe("Discount amount"),
        discount_rate: z
          .object({
            benefit_percentage: z.string().optional().nullable(),
            benefit_percentage_round_unit: z.string().optional().nullable(),
            benefit_percentage_max_price: z.string().optional().nullable(),
          })
          .strict()
          .optional()
          .describe("Discount rate"),
        serial_generate_method: z.enum(["A", "M"]).describe("Serial coupon generation method"),
        serial_code_type: z.enum(["R", "S"]).describe("Serial code generation method"),
        serial_generate_auto: z
          .object({
            issue_max_count: z.number().int().optional(),
            serial_code_length: z.number().int().optional(),
          })
          .strict()
          .optional()
          .describe("Auto generation settings"),
      })
      .strict()
      .describe("Serial coupon creation payload"),
  })
  .strict();

export const SerialCouponDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    coupon_no: z.string().min(1).describe("Coupon number"),
  })
  .strict();

export type SerialCouponsSearchParams = z.infer<typeof SerialCouponsSearchParamsSchema>;
export type SerialCouponCreateParams = z.infer<typeof SerialCouponCreateParamsSchema>;
export type SerialCouponDeleteParams = z.infer<typeof SerialCouponDeleteParamsSchema>;
