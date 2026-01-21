import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Supplier } from "@/types/index.js";
import { type SuppliersSearchParams, SuppliersSearchParamsSchema } from "@/schemas/supplier.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

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

export function registerTools(server: McpServer): void {
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
}
