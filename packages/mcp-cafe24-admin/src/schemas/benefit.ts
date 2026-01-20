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
