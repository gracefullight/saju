import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DailySales } from "@/types/index.js";
import { type SalesSearchParams, SalesSearchParamsSchema } from "@/schemas/sales.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

async function cafe24_get_daily_sales(params: SalesSearchParams) {
  try {
    const data = await makeApiRequest<{ daily_sales: DailySales[]; total: number }>(
      "/admin/financials/dailysales",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
        start_date: params.start_date,
        end_date: params.end_date,
      },
    );

    const sales = data.daily_sales || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Daily sales from ${params.start_date} to ${params.end_date}\n\n` +
            sales
              .map((s) => `## ${s.date}\n- **Sales**: ${s.sales_count} (${s.sales_amount})\n`)
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: sales.length,
        offset: params.offset,
        daily_sales: sales.map((s) => ({
          date: s.date,
          sales_count: s.sales_count,
          sales_amount: s.sales_amount,
        })),
        has_more: total > params.offset + sales.length,
        ...(total > params.offset + sales.length
          ? { next_offset: params.offset + sales.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_daily_sales",
    {
      title: "Get Cafe24 Daily Sales Report",
      description:
        "Retrieve daily sales report from Cafe24. Requires date range and supports pagination. Returns sales count and amount for each day.",
      inputSchema: SalesSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_daily_sales,
  );
}
