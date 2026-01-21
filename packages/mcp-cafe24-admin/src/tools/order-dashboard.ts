import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type GetOrderDashboardParams,
  GetOrderDashboardParamsSchema,
} from "../schemas/order-dashboard.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { GetOrderDashboardResponse, OrderDashboard } from "../types/order-dashboard.js";

async function cafe24_get_order_dashboard(params: GetOrderDashboardParams) {
  try {
    const { shop_no } = params;
    const data = await makeApiRequest<GetOrderDashboardResponse>(
      "/admin/orders/dashboard",
      "GET",
      undefined,
      { shop_no },
    );

    const dashboard = data.dashboard;

    return {
      content: [
        {
          type: "text" as const,
          text: formatOrderDashboard(dashboard, shop_no),
        },
      ],
      structuredContent: data as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

function formatOrderDashboard(dashboard: OrderDashboard, shop_no?: number): string {
  const {
    shop_no: dashboardShopNo,
    total_order_count,
    total_paid_count,
    total_refund_count,
    total_order_amount,
    total_paid_amount,
    total_refund_amount,
    cancellation_request_count,
    exchange_request_count,
    return_request_count,
    cancellation_processing_count,
    exchange_processing_count,
    return_processing_count,
    cancellation_received_count,
    exchange_received_count,
    return_received_count,
    refund_pending_count,
  } = dashboard;

  const orderCounts =
    `## Order Counts\n` +
    `- **Total Orders**: ${total_order_count}\n` +
    `- **Total Paid**: ${total_paid_count}\n` +
    `- **Total Refunds**: ${total_refund_count}\n\n`;

  const amounts =
    `## Amounts\n` +
    `- **Order Amount**: ${total_order_amount}\n` +
    `- **Paid Amount**: ${total_paid_amount}\n` +
    `- **Refund Amount**: ${total_refund_amount}\n\n`;

  const requests =
    `### Requests\n` +
    `- **Cancellation**: ${cancellation_request_count}\n` +
    `- **Exchange**: ${exchange_request_count}\n` +
    `- **Return**: ${return_request_count}\n\n`;

  const processing =
    `### Processing\n` +
    `- **Cancellation**: ${cancellation_processing_count}\n` +
    `- **Exchange**: ${exchange_processing_count}\n` +
    `- **Return**: ${return_processing_count}\n\n`;

  const received =
    `### Received\n` +
    `- **Cancellation**: ${cancellation_received_count}\n` +
    `- **Exchange**: ${exchange_received_count}\n` +
    `- **Return**: ${return_received_count}\n\n`;

  return (
    `# Order Dashboard (Shop #${dashboardShopNo || shop_no})\n\n` +
    orderCounts +
    amounts +
    `## Claims Status\n` +
    requests +
    processing +
    received +
    `- **Refund Pending**: ${refund_pending_count}\n`
  );
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_order_dashboard",
    {
      title: "Get Cafe24 Order Dashboard",
      description: "Retrieve dashboard statistics related to orders, claims, and sales amounts.",
      inputSchema: GetOrderDashboardParamsSchema,
    },
    cafe24_get_order_dashboard,
  );
}
