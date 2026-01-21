import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type DashboardParams, DashboardParamsSchema } from "@/schemas/dashboard.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { Dashboard, SalesStat, SummaryStat } from "@/types/index.js";

async function cafe24_get_dashboard(params: DashboardParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/dashboard", "GET", undefined, queryParams);
    const responseData = data as
      | { dashboard?: Record<string, unknown>[] }
      | { dashboard?: Record<string, unknown>[] };
    const dashboards = responseData.dashboard || [];
    const dashboard = (dashboards[0] || {}) as Dashboard;

    const dailyStats = dashboard.daily_sales_stats || [];
    const weeklyStats = (dashboard.weekly_sales_stats || {}) as SummaryStat;
    const monthlyStats = (dashboard.monthly_sales_stats || {}) as SummaryStat;
    const boardList = dashboard.board_list || [];

    // Get today's stats (last item in dailyStats)
    const todayStats = dailyStats[dailyStats.length - 1] || {};

    return {
      content: [
        {
          type: "text" as const,
          text: formatDashboard(dashboard, todayStats, weeklyStats, monthlyStats, boardList),
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

function formatDashboard(
  dashboard: Dashboard,
  todayStats: SalesStat,
  weeklyStats: SummaryStat,
  monthlyStats: SummaryStat,
  boardList: unknown[],
): string {
  const shopNo = dashboard.shop_no || 1;

  return (
    `## Dashboard (Shop #${shopNo})\n\n` +
    formatDailyStats(todayStats) +
    formatWeeklyStats(weeklyStats) +
    formatMonthlyStats(monthlyStats) +
    `### Store Status\n` +
    `- **Sold Out Products**: ${dashboard.sold_out_products_count || 0}\n` +
    `- **New Members**: ${dashboard.new_members_count || 0}\n` +
    `- **Boards**: ${boardList.length}\n`
  );
}

function formatDailyStats(stats: SalesStat): string {
  const date = stats.date || "N/A";
  const orderPrice = stats.order_price || "0.00";
  const paidPrice = stats.paid_price || "0.00";
  const refundPrice = stats.refund_price || "0.00";

  return (
    `### Today (${date})\n` +
    `- **Order Price**: ${orderPrice}\n` +
    `- **Paid Price**: ${paidPrice}\n` +
    `- **Refund Price**: ${refundPrice}\n` +
    `- **Orders**: ${stats.order_count || 0} | **Paid**: ${stats.payed_count || 0} | **Refunds**: ${stats.refund_count || 0}\n` +
    `- **Shipping**: ${stats.shipping_count || 0} | **Shipped**: ${stats.shipped_count || 0}\n` +
    `- **Canceled**: ${stats.canceled_count || 0} | **Returned**: ${stats.returned_count || 0} | **Exchanged**: ${stats.exchanged_count || 0}\n\n`
  );
}

function formatWeeklyStats(stats: SummaryStat): string {
  const orderTotal = stats.ordered_total_price || "0.00";
  const paidTotal = stats.payed_total_price || "0.00";
  const refundTotal = stats.refunded_total_price || "0.00";

  return (
    `### Weekly Summary\n` +
    `- **Total Orders**: ${orderTotal} (${stats.ordered_count || 0} orders)\n` +
    `- **Total Paid**: ${paidTotal} (${stats.payed_count || 0} payments)\n` +
    `- **Total Refunds**: ${refundTotal} (${stats.refunded_count || 0} refunds)\n\n`
  );
}

function formatMonthlyStats(stats: SummaryStat): string {
  const orderTotal = stats.ordered_total_price || "0.00";
  const paidTotal = stats.payed_total_price || "0.00";
  const refundTotal = stats.refunded_total_price || "0.00";

  return (
    `### Monthly Summary\n` +
    `- **Total Orders**: ${orderTotal} (${stats.ordered_count || 0} orders)\n` +
    `- **Total Paid**: ${paidTotal} (${stats.payed_count || 0} payments)\n` +
    `- **Total Refunds**: ${refundTotal} (${stats.refunded_count || 0} refunds)\n\n`
  );
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
