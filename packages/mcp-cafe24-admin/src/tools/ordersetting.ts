import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  OrderSettingParamsSchema,
  OrderSettingUpdateParamsSchema,
} from "@/schemas/ordersetting.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

interface OrderSettingResult {
  shop_no?: number;
  claim_request?: string;
  stock_recover?: string;
  auto_delivery_completion?: string;
  delivery_completion_after_days?: number;
  auto_cancel?: string;
  exchange_shipping_fee?: string;
  return_shipping_fee?: string;
  [key: string]: unknown;
}

async function cafe24_get_order_setting(params: z.infer<typeof OrderSettingParamsSchema>) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/orders/setting", "GET", undefined, queryParams);
    const responseData = data as { order?: Record<string, unknown> } | Record<string, unknown>;
    const order = (responseData.order || responseData) as OrderSettingResult;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Order Settings (Shop #${order.shop_no || 1})\n\n` +
            `- **Buyer Claim Request**: ${order.claim_request === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Auto Stock Recover**: ${order.stock_recover === "T" ? "Basic" : "Individual"}\n` +
            `- **Auto Delivery Completion**: ${order.auto_delivery_completion === "T" ? "Enabled" : "Disabled"} (${order.delivery_completion_after_days} days)\n` +
            `- **Auto Cancel Unpaid**: ${order.auto_cancel === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Exchange Fee**: ${order.exchange_shipping_fee}\n` +
            `- **Return Fee**: ${order.return_shipping_fee}\n`,
        },
      ],
      structuredContent: order as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order_setting(params: z.infer<typeof OrderSettingUpdateParamsSchema>) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/orders/setting", "PUT", requestBody);
    const responseData = data as { order?: Record<string, unknown> } | Record<string, unknown>;
    const order = (responseData.order || responseData) as OrderSettingResult;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Order Settings Updated (Shop #${order.shop_no || 1})\n\n` +
            `- **Buyer Claim Request**: ${order.claim_request === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Auto Stock Recover**: ${order.stock_recover === "T" ? "Basic" : "Individual"}\n`,
        },
      ],
      structuredContent: order as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_order_setting",
    {
      title: "Get Cafe24 Order Settings",
      description:
        "Retrieve order settings regarding buyer claims, stock recovery, refund processing, purchase confirmation, and auto-cancellation policies.",
      inputSchema: OrderSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_order_setting,
  );

  server.registerTool(
    "cafe24_update_order_setting",
    {
      title: "Update Cafe24 Order Settings",
      description:
        "Update order settings. Configure buyer claim requests, stock recovery options, refund policies, purchase confirmation automation, shipping fees, and auto-cancellation rules.",
      inputSchema: OrderSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_order_setting,
  );
}
