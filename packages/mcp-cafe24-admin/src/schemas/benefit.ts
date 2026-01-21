import { z } from "zod";

export const BenefitSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default:1)"),
  })
  .strict();

export const BenefitSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use_gift: z.enum(["T", "F"]).optional().describe("Enable gift feature: T=Yes, F=No"),
    available_payment_methods: z
      .enum(["all", "bank_only", "exclude_bank"])
      .optional()
      .describe("Payment methods for gifts: all, bank_only, exclude_bank"),
    allow_point_payment: z
      .enum(["T", "F"])
      .optional()
      .describe("Offer gift for full point payment: T=Yes, F=No"),
    gift_calculation_scope: z
      .enum(["all", "benefit"])
      .optional()
      .describe("Gift calculation scope: all=All products, benefit=Benefit applied only"),
    gift_calculation_type: z
      .enum(["total_order", "actual_payment"])
      .optional()
      .describe("Gift calculation type: total_order, actual_payment"),
    include_point_usage: z
      .enum(["T", "F"])
      .optional()
      .describe("Include point usage amount: T=Include, F=Exclude"),
    include_shipping_fee: z
      .enum(["I", "E"])
      .optional()
      .describe("Include shipping fee: I=Include, E=Exclude"),
    display_soldout_gifts: z
      .enum(["grayed", "disabled"])
      .optional()
      .describe("Display soldout gifts: grayed=Show but disabled, disabled=Hide"),
    gift_grant_type: z
      .enum(["S", "A"])
      .optional()
      .describe("Gift grant type: S=Customer selection, A=Automatic"),
    gift_selection_mode: z
      .enum(["S", "M"])
      .optional()
      .describe("Gift selection mode: S=Single, M=Multiple"),
    gift_grant_mode: z
      .enum(["S", "M"])
      .optional()
      .describe("Gift grant mode: S=Single, M=Multiple"),
    gift_selection_step: z
      .array(z.enum(["order_form", "order_complete", "order_detail"]))
      .optional()
      .describe("Gift selection steps: order_form, order_complete, order_detail"),
    gift_available_condition: z
      .enum(["during_period", "after_period"])
      .optional()
      .describe("Gift availability: during_period, after_period"),
    offer_only_one_in_automatic: z
      .enum(["T", "F"])
      .optional()
      .describe("Auto gift quantity: T=Only 1, F=Based on purchase quantity"),
    allow_gift_review: z.enum(["T", "F"]).optional().describe("Allow gift review: T=Yes, F=No"),
  })
  .strict();

export type BenefitSettingParams = z.infer<typeof BenefitSettingParamsSchema>;
export type BenefitSettingUpdateParams = z.infer<typeof BenefitSettingUpdateParamsSchema>;

export const BenefitsSearchParamsSchema = z
  .object({
    shop_no: z.number().optional().describe("Shop Number (Default: 1)"),
    use_benefit: z
      .enum(["T", "F"])
      .optional()
      .describe("Whether proceed benefit (T: proceed, F: do not proceed)"),
    benefit_name: z.string().optional().describe("Name of benefit"),
    benefit_type: z
      .enum(["DP", "DR", "DQ", "DM", "DN", "DV", "PG", "PB"])
      .optional()
      .describe(
        "Detail type of benefit (DP: period discount, DR: re-order discount, DQ: bundle purchase, DM: member, DN: new product, DV: shipping, PG: gift, PB: 1+N)",
      ),
    period_type: z
      .enum(["R", "S", "E"])
      .optional()
      .describe("Type of benefit period (R: registered, S: start, E: end)"),
    benefit_start_date: z.string().optional().describe("Search Start Date (YYYY-MM-DD)"),
    benefit_end_date: z.string().optional().describe("Search End Date (YYYY-MM-DD)"),
    platform_types: z.string().optional().describe("Coverage of benefit (comma separated: P,M,A)"),
    offset: z.number().optional().describe("Start location of list (Default: 0)"),
    limit: z.number().min(1).max(100).optional().describe("Limit (Default: 10)"),
  })
  .strict();

export const BenefitCreateSchema = z
  .object({
    shop_no: z.number().optional().describe("Shop Number (Default: 1)"),
    use_benefit: z
      .enum(["T", "F"])
      .describe("Whether proceed benefit (T: proceed, F: do not proceed)"),
    benefit_name: z.string().max(255).describe("Name of benefit"),
    benefit_division: z.enum(["D", "P"]).describe("Type of benefit (D: discount, P: present/gift)"),
    benefit_type: z
      .enum(["DP", "DR", "DQ", "DM", "DN", "DV", "PG", "PB"])
      .describe("Detail type of benefit (DP, DR, DQ, DM, DN, DV, PG, PB)"),
    use_benefit_period: z
      .enum(["T", "F"])
      .optional()
      .describe("Benefit period setting (T: Used, F: Not used)"),
    benefit_start_date: z.string().optional().describe("Benefit start date (YYYY-MM-DD...)"),
    benefit_end_date: z.string().optional().describe("Benefit end date (YYYY-MM-DD...)"),
    platform_types: z
      .array(z.enum(["P", "M", "A"]))
      .describe("Coverage of benefit (P: PC, M: Mobile, A: Plus app)"),
    use_group_binding: z
      .enum(["A", "N", "M"])
      .optional()
      .describe("Participation target (A: customer+guest, N: guest, M: customer)"),
    customer_group_list: z
      .array(z.number())
      .optional()
      .describe("Customer tiers (Required if use_group_binding is M)"),
    product_binding_type: z
      .enum(["A", "P", "E", "C"])
      .optional()
      .describe("Product range (A: all, P: specified, E: exceptions, C: categories)"),
    use_except_category: z
      .enum(["T", "F"])
      .optional()
      .describe("Exclude product tax benefit (T: Used, F: Not used)"),
    available_coupon: z
      .enum(["T", "F"])
      .optional()
      .describe("Coverage of coupon (T: can use every, F: cannot use)"),
    icon_url: z.string().optional().describe("Path to icon (or base64)"),
    period_sale: z
      .object({
        product_list: z.array(z.number()).optional(),
        add_category_list: z.array(z.number()).optional(),
        except_category_list: z.array(z.number()).optional(),
        discount_purchasing_quantity: z.number().optional().nullable(),
        discount_value: z.string().describe("Discount value"),
        discount_value_unit: z.enum(["P", "W"]).describe("Discount unit (P: %, W: Won)"),
        discount_truncation_unit: z.enum(["O", "T", "H"]).optional().nullable(),
        discount_truncation_method: z.enum(["U", "D", "R"]).optional().nullable(),
      })
      .optional()
      .describe("Limited time discount settings"),
    // Other specific sale types can be added as needed based on use case,
    // kept minimal for now to match common usage in prompt
  })
  .strict();

export const BenefitUpdateSchema = z
  .object({
    shop_no: z.number().optional().describe("Shop Number (Default: 1)"),
    benefit_no: z.number().describe("Benefit Number to update"),
    use_benefit: z
      .enum(["T", "F"])
      .optional()
      .describe("Whether proceed benefit (T: proceed, F: do not proceed)"),
    benefit_name: z.string().max(255).optional().describe("Name of benefit"),
    use_benefit_period: z.enum(["T", "F"]).optional().describe("Benefit period setting"),
    benefit_start_date: z.string().optional().describe("Benefit start date"),
    benefit_end_date: z.string().optional().describe("Benefit end date"),
    platform_types: z
      .array(z.enum(["P", "M", "A"]))
      .optional()
      .describe("Coverage of benefit"),
    use_group_binding: z.enum(["A", "N", "M"]).optional().describe("Participation target"),
    customer_group_list: z.array(z.number()).optional().describe("Customer tiers"),
    product_binding_type: z.enum(["A", "P", "E", "C"]).optional().describe("Product range"),
    use_except_category: z.enum(["T", "F"]).optional().describe("Exclude product tax benefit"),
    available_coupon: z.enum(["T", "F"]).optional().describe("Coverage of coupon"),
    icon_url: z.string().optional().describe("Path to icon"),
    period_sale: z
      .object({
        product_list: z.array(z.number()).optional(),
        add_category_list: z.array(z.number()).optional(),
        except_category_list: z.array(z.number()).optional(),
        discount_purchasing_quantity: z.number().optional().nullable(),
        discount_value: z.string().optional(),
        discount_value_unit: z.enum(["P", "W"]).optional(),
        discount_truncation_unit: z.enum(["O", "T", "H"]).optional().nullable(),
        discount_truncation_method: z.enum(["U", "D", "R"]).optional().nullable(),
      })
      .optional()
      .describe("Limited time discount settings"),
  })
  .strict();

export const BenefitDeleteSchema = z
  .object({
    shop_no: z.number().optional().describe("Shop Number (Default: 1)"),
    benefit_no: z.number().describe("Benefit Number to delete"),
  })
  .strict();

export type BenefitsSearchParams = z.infer<typeof BenefitsSearchParamsSchema>;
export type BenefitCreate = z.infer<typeof BenefitCreateSchema>;
export type BenefitUpdate = z.infer<typeof BenefitUpdateSchema>;
export type BenefitDelete = z.infer<typeof BenefitDeleteSchema>;
