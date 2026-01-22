import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CountTrends,
  CountTrendsSchema,
  type ListTrends,
  ListTrendsSchema,
} from "@/schemas/trend.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { TrendCountResponse, TrendsResponse } from "@/types/index.js";

async function cafe24_list_trends(params: ListTrends) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<TrendsResponse>(
      "/admin/trends",
      "GET",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    const trends = data.trends || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${trends.length} trends.\n\n` +
            trends
              .map(
                (t) =>
                  `- [${t.trend_code}] ${t.trend_name}\n  Used: ${t.use_trend === "T" ? "Yes" : "No"}, Products: ${t.product_count ?? 0}`,
              )
              .join("\n"),
        },
      ],
      structuredContent: { trends },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_trends(params: CountTrends) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<TrendCountResponse>(
      "/admin/trends/count",
      "GET",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Total trend count: ${data.count}`,
        },
      ],
      structuredContent: { count: data.count },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_trends",
    {
      title: "List Trends",
      description: "Retrieve a list of trends",
      inputSchema: ListTrendsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_trends,
  );

  server.registerTool(
    "cafe24_count_trends",
    {
      title: "Count Trends",
      description: "Retrieve the count of trends",
      inputSchema: CountTrendsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_trends,
  );
}
