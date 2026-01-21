import { z } from "zod";

export const OrdersSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    start_date: z.string().optional().describe("Search Start Date (YYYY-MM-DD or ISO 8601)"),
    end_date: z.string().optional().describe("Search End Date (YYYY-MM-DD or ISO 8601)"),
    date_type: z
      .enum([
        "order_date",
        "pay_date",
        "shipbegin_date",
        "shipend_date",
        "cancel_date",
        "place_date",
        "cancel_request_date",
        "cancel_accept_date",
        "cancel_complete_date",
        "exchange_request_date",
        "exchange_accept_date",
        "exchange_complete_date",
        "return_request_date",
        "return_accept_date",
        "return_complete_date",
        "purchaseconfirmation_date",
      ])
      .default("order_date")
      .describe("Date type for search"),
    order_id: z.string().optional().describe("Order ID(s), comma-separated"),
    order_status: z.string().optional().describe("Order status code(s), comma-separated"),
    payment_status: z
      .enum(["F", "M", "T", "A", "P"])
      .optional()
      .describe("Payment status (F: awaiting, M: additional, T: manual, A: auto, P: complete)"),
    member_type: z.enum(["2", "3"]).optional().describe("Member type (2: Member, 3: Nonmember)"),
    group_no: z.number().optional().describe("Group number"),
    buyer_name: z.string().optional().describe("Buyer name"),
    receiver_name: z.string().optional().describe("Receiver name"),
    member_id: z.string().optional().describe("Member ID"),
    member_email: z.string().optional().describe("Customer email"),
    product_no: z.string().optional().describe("Product number(s), comma-separated"),
    product_code: z.string().optional().describe("Product code(s), comma-separated"),
    order_place_id: z
      .string()
      .optional()
      .describe("Order path(s), comma-separated (e.g., cafe24, mobile, NCHECKOUT)"),
    payment_method: z
      .string()
      .optional()
      .describe("Payment method code(s), comma-separated (e.g., cash, card, tcash)"),
    subscription: z.enum(["T", "F"]).optional().describe("Subscription payment (T: Yes, F: No)"),
    market_order_no: z.string().optional().describe("Market order number(s), comma-separated"),
    market_seller_id: z.string().optional().describe("Marketplace vendor ID"),
    limit: z.number().int().min(1).max(1000).default(10).describe("Limit results (max 1000)"),
    offset: z.number().int().min(0).max(15000).default(0).describe("Start location of list"),
    embed: z
      .string()
      .optional()
      .describe("Embed resources (items, receivers, buyer, return, cancellation, exchange)"),
  })
  .strict();

export const OrdersCountParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    start_date: z.string().optional().describe("Search Start Date (YYYY-MM-DD or ISO 8601)"),
    end_date: z.string().optional().describe("Search End Date (YYYY-MM-DD or ISO 8601)"),
    date_type: z
      .enum([
        "order_date",
        "pay_date",
        "shipbegin_date",
        "shipend_date",
        "cancel_date",
        "place_date",
        "cancel_request_date",
        "cancel_accept_date",
        "cancel_complete_date",
        "exchange_request_date",
        "exchange_accept_date",
        "exchange_complete_date",
        "return_request_date",
        "return_accept_date",
        "return_complete_date",
        "purchaseconfirmation_date",
      ])
      .default("order_date")
      .describe("Date type for search"),
    order_id: z.string().optional().describe("Order ID(s), comma-separated"),
    order_status: z.string().optional().describe("Order status code(s), comma-separated"),
    payment_status: z.string().optional().describe("Payment status (F, M, T, A, P)"),
    member_type: z.enum(["2", "3"]).optional().describe("Member type (2: Member, 3: Nonmember)"),
    group_no: z.number().optional().describe("Group number"),
    buyer_name: z.string().optional().describe("Buyer name"),
    receiver_name: z.string().optional().describe("Receiver name"),
    member_id: z.string().optional().describe("Member ID"),
    member_email: z.string().optional().describe("Customer email"),
    product_no: z.string().optional().describe("Product number(s), comma-separated"),
    product_code: z.string().optional().describe("Product code(s), comma-separated"),
    order_place_id: z.string().optional().describe("Order path(s), comma-separated"),
    subscription: z.enum(["T", "F"]).optional().describe("Subscription payment (T: Yes, F: No)"),
    multiple_addresses: z.enum(["T"]).optional().describe("Multi-address order (T: Yes)"),
    first_order: z.enum(["T", "F"]).optional().describe("First order (T: Yes, F: No)"),
    refund_status: z.string().optional().describe("Refund status (F, T, M)"),
  })
  .strict();

export const OrderDetailParamsSchema = z
  .object({
    order_id: z.string().describe("Order ID"),
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    embed: z
      .string()
      .optional()
      .describe(
        "Embed resources (items, receivers, buyer, benefits, coupons, return, cancellation, exchange, refunds)",
      ),
  })
  .strict();

export const OrderUpdateRequestItemSchema = z.object({
  order_id: z.string().describe("Order ID"),
  process_status: z
    .enum(["prepare", "prepareproduct", "hold", "unhold"])
    .optional()
    .describe("Order status"),
  order_item_code: z.array(z.string()).optional().describe("Order item code(s)"),
  purchase_confirmation: z.enum(["T", "F"]).optional().describe("Purchase confirmation"),
  collect_points: z.enum(["T", "F"]).optional().describe("Recapture points"),
  show_shipping_address: z.enum(["T", "F"]).optional().describe("Display shipping address"),
});

export const BulkOrderUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    requests: z.array(OrderUpdateRequestItemSchema).describe("List of update requests"),
  })
  .strict();

export const OrderUpdateParamsSchema = z
  .object({
    order_id: z.string().describe("Order ID"),
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    request: z
      .object({
        process_status: z
          .enum(["prepare", "prepareproduct", "hold", "unhold"])
          .optional()
          .describe("Order status"),
        order_item_code: z.array(z.string()).optional().describe("Order item code(s)"),
        purchase_confirmation: z.enum(["T", "F"]).optional().describe("Purchase confirmation"),
        collect_points: z.enum(["T", "F"]).optional().describe("Recapture points"),
        show_shipping_address: z.enum(["T", "F"]).optional().describe("Display shipping address"),
      })
      .describe("Update details"),
  })
  .strict();

export const OrderUpdateStatusParamsSchema = z
  .object({
    order_id: z.string().describe("Order ID"),
    order_status_code: z.string().describe("New order status code"),
  })
  .strict();

export const OrderStatusSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const OrderStatusRequestSchema = z.object({
  status_name_id: z.number().int().describe("Status name ID"),
  custom_name: z.string().optional().describe("Custom status name"),
  reservation_custom_name: z.string().optional().describe("Custom reservation status name"),
});

export const OrderStatusUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    requests: z.array(OrderStatusRequestSchema).describe("List of status updates"),
  })
  .strict();
