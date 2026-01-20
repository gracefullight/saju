import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type MileageSearchParams,
  MileageSearchParamsSchema,
  type SalesSearchParams,
  SalesSearchParamsSchema,
  type SuppliersSearchParams,
  SuppliersSearchParamsSchema,
  type ThemesSearchParams,
  ThemesSearchParamsSchema,
} from "@/schemas/misc.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { DailySales, Point, Supplier, Theme } from "../types.js";

async function cafe24_list_themes(params: ThemesSearchParams) {
  try {
    const data = await makeApiRequest<{ themes: Theme[]; total: number }>(
      "/admin/themes",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
      },
    );

    const themes = data.themes || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} themes (showing ${themes.length})\n\n` +
            themes.map((t) => `## ${t.theme_name} (Theme #${t.theme_no})\n`).join(""),
        },
      ],
      structuredContent: {
        total,
        count: themes.length,
        offset: params.offset,
        themes: themes.map((t) => ({
          id: t.theme_no.toString(),
          name: t.theme_name,
        })),
        has_more: total > params.offset + themes.length,
        ...(total > params.offset + themes.length
          ? { next_offset: params.offset + themes.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_suppliers(params: SuppliersSearchParams) {
  try {
    const data = await makeApiRequest<{ suppliers: Supplier[]; total: number }>(
      "/admin/suppliers",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
      },
    );

    const suppliers = data.suppliers || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} suppliers (showing ${suppliers.length})\n\n` +
            suppliers.map((s) => `## ${s.supplier_name} (${s.supplier_no})\n`).join(""),
        },
      ],
      structuredContent: {
        total,
        count: suppliers.length,
        offset: params.offset,
        suppliers: suppliers.map((s) => ({
          id: s.supplier_no.toString(),
          name: s.supplier_name,
        })),
        has_more: total > params.offset + suppliers.length,
        ...(total > params.offset + suppliers.length
          ? { next_offset: params.offset + suppliers.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

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

async function cafe24_get_points(params: MileageSearchParams) {
  try {
    const data = await makeApiRequest<{ points: Point[]; total: number }>(
      "/admin/points",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
        ...(params.start_date ? { start_date: params.start_date } : {}),
        ...(params.end_date ? { end_date: params.end_date } : {}),
      },
    );

    const points = data.points || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} point transactions (showing ${points.length})\n\n` +
            points
              .map(
                (p) =>
                  `## ${p.point_date}\n` +
                  `- **Member**: ${p.member_name} (${p.member_id})\n` +
                  `- **Type**: ${p.point_type || "Earn"}\n` +
                  `- **Amount**: ${p.point}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: points.length,
        offset: params.offset,
        points: points.map((p) => ({
          id: p.point_id,
          member_id: p.member_id,
          member_name: p.member_name,
          point_type: p.point_type,
          point: p.point,
          point_date: p.point_date,
        })),
        has_more: total > params.offset + points.length,
        ...(total > params.offset + points.length
          ? { next_offset: params.offset + points.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_themes",
    {
      title: "List Cafe24 Themes",
      description:
        "Retrieve a list of themes from Cafe24. Returns theme details including theme number and name. Supports pagination.",
      inputSchema: ThemesSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_themes,
  );

  server.registerTool(
    "cafe24_list_suppliers",
    {
      title: "List Cafe24 Suppliers",
      description:
        "Retrieve a list of suppliers from Cafe24. Returns supplier details including supplier number and name. Supports pagination.",
      inputSchema: SuppliersSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_suppliers,
  );

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

  server.registerTool(
    "cafe24_get_points",
    {
      title: "Get Cafe24 Points Transactions",
      description:
        "Retrieve point/mileage transactions from Cafe24. Requires date range and supports pagination. Returns point details including member ID, type, amount, and date.",
      inputSchema: MileageSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_points,
  );
}
