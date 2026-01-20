import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type DashboardParams, DashboardParamsSchema } from "@/schemas/dashboard.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_get_dashboard(params: DashboardParams) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/dashboard", "GET", undefined, queryParams);
    const dashboards = data.dashboard || [];
    const dashboard = dashboards[0] || {};

    const dailyStats = dashboard.daily_sales_stats || [];
    const weeklyStats = dashboard.weekly_sales_stats || {};
    const monthlyStats = dashboard.monthly_sales_stats || {};
    const boardList = dashboard.board_list || [];

    // Get today's stats (last item in dailyStats)
    const todayStats = dailyStats[dailyStats.length - 1] || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Dashboard (Shop #${dashboard.shop_no || 1})\n\n` +
            `### Today (${todayStats.date || "N/A"})\n` +
            `- **Order Price**: ${todayStats.order_price || "0.00"}\n` +
            `- **Paid Price**: ${todayStats.paid_price || "0.00"}\n` +
            `- **Refund Price**: ${todayStats.refund_price || "0.00"}\n` +
            `- **Orders**: ${todayStats.order_count || 0} | **Paid**: ${todayStats.payed_count || 0} | **Refunds**: ${todayStats.refund_count || 0}\n` +
            `- **Shipping**: ${todayStats.shipping_count || 0} | **Shipped**: ${todayStats.shipped_count || 0}\n` +
            `- **Canceled**: ${todayStats.canceled_count || 0} | **Returned**: ${todayStats.returned_count || 0} | **Exchanged**: ${todayStats.exchanged_count || 0}\n\n` +
            `### Weekly Summary\n` +
            `- **Total Orders**: ${weeklyStats.ordered_total_price || "0.00"} (${weeklyStats.ordered_count || 0} orders)\n` +
            `- **Total Paid**: ${weeklyStats.payed_total_price || "0.00"} (${weeklyStats.payed_count || 0} payments)\n` +
            `- **Total Refunds**: ${weeklyStats.refunded_total_price || "0.00"} (${weeklyStats.refunded_count || 0} refunds)\n\n` +
            `### Monthly Summary\n` +
            `- **Total Orders**: ${monthlyStats.ordered_total_price || "0.00"} (${monthlyStats.ordered_count || 0} orders)\n` +
            `- **Total Paid**: ${monthlyStats.payed_total_price || "0.00"} (${monthlyStats.payed_count || 0} payments)\n` +
            `- **Total Refunds**: ${monthlyStats.refunded_total_price || "0.00"} (${monthlyStats.refunded_count || 0} refunds)\n\n` +
            `### Store Status\n` +
            `- **Sold Out Products**: ${dashboard.sold_out_products_count || 0}\n` +
            `- **New Members**: ${dashboard.new_members_count || 0}\n` +
            `- **Boards**: ${boardList.length}\n`,
        },
      ],
      structuredContent: {
        shop_no: dashboard.shop_no ?? 1,
        daily_sales_stats: dailyStats,
        weekly_sales_stats: weeklyStats,
        monthly_sales_stats: monthlyStats,
        sold_out_products_count: dashboard.sold_out_products_count ?? 0,
        new_members_count: dashboard.new_members_count ?? 0,
        board_list: boardList,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_dashboard",
    {
      title: "Get Cafe24 Dashboard",
      description:
        "Retrieve dashboard overview including daily/weekly/monthly sales statistics, order counts, payment/refund summaries, sold out products count, new members count, and board list.",
      inputSchema: DashboardParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_dashboard,
  );
}
