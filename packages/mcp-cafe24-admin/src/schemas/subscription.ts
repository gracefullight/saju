import { z } from "zod";

export const SubscriptionDiscountValueSchema = z.object({
  delivery_cycle: z.number().int().describe("Delivery cycle count"),
  discount_amount: z.number().describe("Discount amount or percentage"),
});

export const SubscriptionShipmentParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default:1)"),
    subscription_no: z.number().int().optional().describe("Subscription setting number"),
  })
  .strict();

export const SubscriptionShipmentCreateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    subscription_shipments_name: z.string().max(255).describe("Subscription shipment setting name"),
    product_binding_type: z
      .enum(["A", "P", "C"])
      .describe("Product binding: A=All, P=Product, C=Category"),
    one_time_purchase: z
      .enum(["T", "F"])
      .default("T")
      .optional()
      .describe("Allow one-time purchase: T=Yes, F=No"),
    product_list: z.array(z.number().int()).optional().describe("List of product IDs"),
    category_list: z.array(z.number().int()).optional().describe("List of category IDs"),
    use_discount: z.enum(["T", "F"]).describe("Use discount: T=Yes, F=No"),
    discount_value_unit: z
      .enum(["P", "W"])
      .optional()
      .describe("Discount unit: P=Percent, W=Amount"),
    discount_values: z
      .array(SubscriptionDiscountValueSchema)
      .optional()
      .describe("Discount values per cycle"),
    related_purchase_quantity: z
      .enum(["T", "F"])
      .optional()
      .describe("Related to purchase quantity: T=Yes, F=No"),
    subscription_shipments_cycle_type: z
      .enum(["T", "F"])
      .describe("Use delivery cycle: T=Yes, F=No"),
    subscription_shipments_cycle: z.array(z.string()).describe("Delivery cycles (e.g., 1W, 1M)"),
    subscription_shipments_count_type: z
      .enum(["T", "F"])
      .optional()
      .describe("Use shipment count limit: T=Yes, F=No"),
    subscription_shipments_count: z
      .array(z.number().int())
      .optional()
      .describe("Shipment count options (e.g., 2, 3, 4)"),
    use_order_price_condition: z
      .enum(["T", "F"])
      .describe("Use order price condition: T=Yes, F=No"),
    order_price_greater_than: z
      .union([z.string(), z.number()])
      .optional()
      .describe("Minimum order price for benefit"),
    include_regional_shipping_rate: z
      .enum(["T", "F"])
      .optional()
      .describe("Include regional shipping rate: T=Yes, F=No"),
    shipments_start_date: z
      .number()
      .int()
      .min(1)
      .max(30)
      .default(3)
      .optional()
      .describe("Days until shipment start (1-30)"),
    change_option: z
      .enum(["T", "F"])
      .default("F")
      .optional()
      .describe("Allow option change: T=Yes, F=No"),
  })
  .strict();

export const SubscriptionShipmentUpdateSchema = SubscriptionShipmentCreateSchema.omit({
  shop_no: true,
})
  .partial()
  .extend({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    subscription_no: z.number().int().describe("Subscription setting number to update"),
  })
  .strict();

export const SubscriptionShipmentDeleteSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    subscription_no: z.number().int().describe("Subscription setting number to delete"),
  })
  .strict();

export const SubscriptionShipmentsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default:1)"),
    date_type: z
      .enum(["created_date", "expected_pay_date", "terminated_date"])
      .default("created_date")
      .optional()
      .describe(
        "Date type: created_date = signup date, expected_pay_date = billing date, terminated_date = cancellation date",
      ),
    start_date: z.string().describe("Search Start Date (YYYY-MM-DD)"),
    end_date: z.string().describe("Search End Date (YYYY-MM-DD)"),
    subscription_id: z
      .string()
      .optional()
      .describe("Subscription code (e.g., S-20210716-00000001)"),
    member_id: z.string().max(20).optional().describe("Member ID"),
    buyer_name: z.string().max(100).optional().describe("Orderer name"),
    buyer_phone: z.string().optional().describe("Buyer phone number"),
    buyer_cellphone: z.string().optional().describe("Buyer mobile number"),
    product_no: z
      .string()
      .optional()
      .describe("Product number (multiple values separated by comma)"),
    product_name: z.string().max(250).optional().describe("Product name"),
    product_code: z.string().optional().describe("Product code"),
    variant_code: z.string().optional().describe("Variant code"),
    subscription_shipments_cycle: z
      .string()
      .optional()
      .describe("Delivery frequency. 1W, 2W, 1M, etc. (multiple values separated by comma)"),
    subscription_state: z
      .enum(["U", "P", "C"])
      .optional()
      .describe("Subscription status: U=Subscribed, P=Paused, C=Unsubscribed"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .optional()
      .describe("Limit per page (1-100)"),
    offset: z.number().int().max(5000).default(0).optional().describe("Start location of list"),
  })
  .strict();

export const SubscriptionShipmentItemsUpdateSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default:1)"),
    subscription_id: z.string().describe("Subscription code"),
    requests: z
      .array(
        z.object({
          subscription_item_id: z.number().int().min(1).describe("Subscription item number"),
          subscription_state: z
            .enum(["U", "Q", "O"])
            .optional()
            .describe(
              "Subscription Payments service status. U: Active, Q: Paused by admin, O: Canceled by admin",
            ),
          quantity: z.number().int().min(1).optional().describe("Order quantity"),
          expected_delivery_date: z.string().date().optional().describe("Estimated shipping date"),
          subscription_shipments_cycle: z
            .enum(["1W", "2W", "3W", "4W", "1M", "2M", "3M", "4M", "5M", "6M", "1Y"])
            .optional()
            .describe("Delivery frequency"),
          changed_variant_code: z
            .string()
            .regex(/^[A-Z0-9]{12}$/)
            .optional()
            .describe("Variant code of modified product options"),
          max_delivery_limit: z
            .union([
              z.literal(0),
              z.literal(2),
              z.literal(3),
              z.literal(4),
              z.literal(6),
              z.literal(8),
              z.literal(10),
              z.literal(12),
            ])
            .optional()
            .describe("Number of subscription delivery"),
        }),
      )
      .min(1)
      .describe("List of update requests"),
  })
  .strict();

export type SubscriptionDiscountValue = z.infer<typeof SubscriptionDiscountValueSchema>;
export type SubscriptionShipmentParams = z.infer<typeof SubscriptionShipmentParamsSchema>;
export type SubscriptionShipmentCreate = z.infer<typeof SubscriptionShipmentCreateSchema>;
export type SubscriptionShipmentUpdate = z.infer<typeof SubscriptionShipmentUpdateSchema>;
export type SubscriptionShipmentDelete = z.infer<typeof SubscriptionShipmentDeleteSchema>;
export type SubscriptionShipmentsSearchParams = z.infer<
  typeof SubscriptionShipmentsSearchParamsSchema
>;
export type SubscriptionShipmentItemsUpdate = z.infer<typeof SubscriptionShipmentItemsUpdateSchema>;
