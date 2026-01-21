import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type {
  BulkOrderUpdateResponse,
  Order,
  OrderStatus,
  SingleOrderUpdateResponse,
} from "@/types/index.js";
import {
  BulkOrderUpdateParamsSchema,
  OrderDetailParamsSchema,
  OrderStatusSearchParamsSchema,
  OrderStatusUpdateParamsSchema,
  OrdersCountParamsSchema,
  OrdersSearchParamsSchema,
  OrderUpdateParamsSchema,
  OrderUpdateStatusParamsSchema,
} from "../schemas/order.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_orders(params: z.infer<typeof OrdersSearchParamsSchema>) {
  try {
    const queryParams: Record<string, unknown> = {
      shop_no: params.shop_no,
      limit: params.limit,
      offset: params.offset,
      date_type: params.date_type,
    };

    if (params.start_date) queryParams.start_date = params.start_date;
    if (params.end_date) queryParams.end_date = params.end_date;
    if (params.order_id) queryParams.order_id = params.order_id;
    if (params.order_status) queryParams.order_status = params.order_status;
    if (params.payment_status) queryParams.payment_status = params.payment_status;
    if (params.member_type) queryParams.member_type = params.member_type;
    if (params.group_no) queryParams.group_no = params.group_no;
    if (params.buyer_name) queryParams.buyer_name = params.buyer_name;
    if (params.receiver_name) queryParams.receiver_name = params.receiver_name;
    if (params.member_id) queryParams.member_id = params.member_id;
    if (params.member_email) queryParams.member_email = params.member_email;
    if (params.product_no) queryParams.product_no = params.product_no;
    if (params.product_code) queryParams.product_code = params.product_code;
    if (params.order_place_id) queryParams.order_place_id = params.order_place_id;
    if (params.payment_method) queryParams.payment_method = params.payment_method;
    if (params.subscription) queryParams.subscription = params.subscription;
    if (params.market_order_no) queryParams.market_order_no = params.market_order_no;
    if (params.market_seller_id) queryParams.market_seller_id = params.market_seller_id;
    if (params.embed) queryParams.embed = params.embed;

    const data = await makeApiRequest<{
      orders: Order[];
      links?: Array<{ rel: string; href: string }>;
    }>("/admin/orders", "GET", undefined, queryParams);

    const orders = data.orders || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Cafe24 Orders (Total: ${orders.length} in this page)\n\n` +
            orders
              .map(
                (o) =>
                  `## Order #${o.order_id}\n` +
                  `- **Billing Name**: ${o.billing_name}\n` +
                  `- **Payment Method**: ${o.payment_method_name.join(", ")}\n` +
                  `- **Amount**: ${o.payment_amount} ${o.currency}\n` +
                  `- **Date**: ${o.order_date}\n` +
                  `- **Shipping Status**: ${o.shipping_status}\n` +
                  `- **Status**: ${o.paid === "T" ? "Paid" : "Unpaid"}, ${o.canceled === "T" ? "Canceled" : "Active"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: orders.length,
        offset: params.offset,
        orders,
        links: data.links,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_orders(params: z.infer<typeof OrdersCountParamsSchema>) {
  try {
    const queryParams: Record<string, unknown> = {
      shop_no: params.shop_no,
      date_type: params.date_type,
    };

    if (params.start_date) queryParams.start_date = params.start_date;
    if (params.end_date) queryParams.end_date = params.end_date;
    if (params.order_id) queryParams.order_id = params.order_id;
    if (params.order_status) queryParams.order_status = params.order_status;
    if (params.payment_status) queryParams.payment_status = params.payment_status;
    if (params.member_type) queryParams.member_type = params.member_type;
    if (params.group_no) queryParams.group_no = params.group_no;
    if (params.buyer_name) queryParams.buyer_name = params.buyer_name;
    if (params.receiver_name) queryParams.receiver_name = params.receiver_name;
    if (params.member_id) queryParams.member_id = params.member_id;
    if (params.member_email) queryParams.member_email = params.member_email;
    if (params.product_no) queryParams.product_no = params.product_no;
    if (params.product_code) queryParams.product_code = params.product_code;
    if (params.order_place_id) queryParams.order_place_id = params.order_place_id;
    if (params.subscription) queryParams.subscription = params.subscription;
    if (params.multiple_addresses) queryParams.multiple_addresses = params.multiple_addresses;
    if (params.first_order) queryParams.first_order = params.first_order;
    if (params.refund_status) queryParams.refund_status = params.refund_status;

    const data = await makeApiRequest<{ count: number }>(
      "/admin/orders/count",
      "GET",
      undefined,
      queryParams,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Total order count matching criteria: ${data.count}`,
        },
      ],
      structuredContent: {
        count: data.count,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_order(params: z.infer<typeof OrderDetailParamsSchema>) {
  try {
    const queryParams: Record<string, unknown> = {
      shop_no: params.shop_no,
    };
    if (params.embed) queryParams.embed = params.embed;

    const data = await makeApiRequest<{ order: Order }>(
      `/admin/orders/${params.order_id}`,
      "GET",
      undefined,
      queryParams,
    );
    const order = data.order;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Order Details: ${order.order_id}\n\n` +
            `- **Buyer**: ${order.billing_name} (${order.member_id})\n` +
            `- **Email**: ${order.member_email}\n` +
            `- **Amount**: ${order.payment_amount} ${order.currency}\n` +
            `- **Order Date**: ${order.order_date}\n` +
            `- **Payment Status**: ${order.paid === "T" ? "Paid" : order.paid === "M" ? "Partially Paid" : "Unpaid"}\n` +
            `- **Shipping Status**: ${order.shipping_status}\n` +
            `\n## Amount Details\n` +
            `- Order Price: ${order.actual_order_amount.order_price_amount}\n` +
            `- Shipping Fee: ${order.actual_order_amount.shipping_fee}\n` +
            `- Total Due: ${order.actual_order_amount.total_amount_due}\n`,
        },
      ],
      structuredContent: {
        order,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order(params: z.infer<typeof OrderUpdateParamsSchema>) {
  try {
    const { order_id, shop_no, request } = params;
    const data = await makeApiRequest<SingleOrderUpdateResponse>(
      `/admin/orders/${order_id}`,
      "PUT",
      {
        shop_no,
        request,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Order #${order_id} updated successfully. Status: ${data.order.process_status || "N/A"}`,
        },
      ],
      structuredContent: {
        order: data.order,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_multiple_orders(params: z.infer<typeof BulkOrderUpdateParamsSchema>) {
  try {
    const data = await makeApiRequest<BulkOrderUpdateResponse>("/admin/orders", "PUT", params);

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully processed update for ${data.orders.length} orders.`,
        },
      ],
      structuredContent: {
        orders: data.orders,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order_status(params: z.infer<typeof OrderUpdateStatusParamsSchema>) {
  try {
    await makeApiRequest(`/admin/orders/${params.order_id}`, "PUT", {
      order_status_code: params.order_status_code,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Order #${params.order_id} status updated to ${params.order_status_code}`,
        },
      ],
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_order_statuses(params: z.infer<typeof OrderStatusSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<{ status: OrderStatus[] }>(
      "/admin/orders/status",
      "GET",
      undefined,
      {
        shop_no: params.shop_no,
      },
    );
    const statuses = data.status || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${statuses.length} order statuses\n\n` +
            statuses
              .map(
                (s) =>
                  `## ${s.basic_name} (${s.status_name_id})\n` +
                  `- **Type**: ${s.status_type}\n` +
                  `- **Custom Name**: ${s.custom_name || "N/A"}\n` +
                  `- **Reservation Name**: ${s.reservation_custom_name || "N/A"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: statuses.length,
        statuses: statuses.map((s) => ({
          id: s.status_name_id,
          type: s.status_type,
          basic_name: s.basic_name,
          custom_name: s.custom_name,
          reservation_custom_name: s.reservation_custom_name,
        })),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order_statuses(params: z.infer<typeof OrderStatusUpdateParamsSchema>) {
  try {
    const { shop_no, requests } = params;
    const data = await makeApiRequest<{ status: OrderStatus[] }>("/admin/orders/status", "PUT", {
      shop_no,
      requests,
    });
    const statuses = data.status || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated ${statuses.length} order statuses successfully.`,
        },
      ],
      structuredContent: {
        count: statuses.length,
        statuses: statuses,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_orders",
    {
      title: "List Cafe24 Orders",
      description:
        "Retrieve a list of orders from Cafe24. Returns order details including order ID, name, status codes, payment status, amount, customer info, and order date. Supports extensive filtering by order ID, date range, and order status code. Paginated results.",
      inputSchema: OrdersSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_orders,
  );

  server.registerTool(
    "cafe24_get_order",
    {
      title: "Get Cafe24 Order Details",
      description:
        "Retrieve detailed information about a specific order by order ID. Supports embedding related resources like items, receivers, and returns.",
      inputSchema: OrderDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_order,
  );

  server.registerTool(
    "cafe24_count_orders",
    {
      title: "Count Cafe24 Orders",
      description:
        "Retrieve the count of orders matching dynamic search criteria like date range, status, and customer info.",
      inputSchema: OrdersCountParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_orders,
  );

  server.registerTool(
    "cafe24_update_order",
    {
      title: "Update Cafe24 Order",
      description:
        "Update the processing status (prepare, hold, etc.) and other specific fields of an order.",
      inputSchema: OrderUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_order,
  );

  server.registerTool(
    "cafe24_update_multiple_orders",
    {
      title: "Bulk Update Cafe24 Orders",
      description: "Update processing statuses for multiple orders in a single request.",
      inputSchema: BulkOrderUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_multiple_orders,
  );

  server.registerTool(
    "cafe24_update_order_status",
    {
      title: "Update Cafe24 Order Status (Simple)",
      description:
        "Update the order status code of an existing order in Cafe24. For more complex updates, use cafe24_update_order.",
      inputSchema: OrderUpdateStatusParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_order_status,
  );

  server.registerTool(
    "cafe24_list_order_statuses",
    {
      title: "List Cafe24 Order Statuses",
      description:
        "Retrieve a list of order status definitions from Cafe24. Returns details including status ID, type, basic name, custom name, and reservation custom name.",
      inputSchema: OrderStatusSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_order_statuses,
  );

  server.registerTool(
    "cafe24_update_order_statuses",
    {
      title: "Update Cafe24 Order Statuses",
      description:
        "Update the custom names of order statuses in Cafe24. Allows updating multiple statuses at once.",
      inputSchema: OrderStatusUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_update_order_statuses,
  );
}
