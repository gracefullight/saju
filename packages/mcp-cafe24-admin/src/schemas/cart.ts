import { z } from "zod";

export const CartSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const CartSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    wishlist_display: z
      .enum(["T", "F"])
      .optional()
      .describe("Display wishlist in cart: T=Yes, F=No"),
    add_action_type: z
      .enum(["M", "S"])
      .optional()
      .describe("Action after adding to cart: M=Go to cart page, S=Show selection popup"),
    cart_item_direct_purchase: z
      .enum(["T", "F"])
      .optional()
      .describe("Allow direct purchase from cart: T=Yes, F=No"),
    storage_period: z
      .enum(["T", "F"])
      .optional()
      .describe("Enable cart storage period: T=Yes, F=No"),
    period: z
      .enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "14", "30"])
      .optional()
      .describe("Cart storage period in days: 1-10, 14, or 30"),
    icon_display: z.enum(["T", "F"]).optional().describe("Display add to cart icon: T=Yes, F=No"),
    cart_item_option_change: z
      .enum(["T", "F"])
      .optional()
      .describe("Allow option change in cart: T=Yes, F=No"),
    discount_display: z
      .enum(["T", "F"])
      .optional()
      .describe("Display discount amount in cart: T=Yes, F=No"),
  })
  .strict();

export type CartSettingParams = z.infer<typeof CartSettingParamsSchema>;
export type CartSettingUpdateParams = z.infer<typeof CartSettingUpdateParamsSchema>;
