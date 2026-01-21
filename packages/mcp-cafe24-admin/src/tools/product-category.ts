import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import { CategoriesSearchParamsSchema } from "@/schemas/product.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { Category } from "@/types/product.js";

async function cafe24_list_categories(params: z.infer<typeof CategoriesSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<{ categories: Category[]; total: number }>(
      "/admin/categories",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
        ...(params.parent_category_no ? { parent_category_no: params.parent_category_no } : {}),
      },
    );

    const categories = data.categories || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} categories (showing ${categories.length})\n\n` +
            categories
              .map(
                (c) =>
                  `## ${c.category_name} (${c.category_no})\n- **Depth**: ${c.category_depth}\n- **Parent**: ${c.parent_category_no || "None"}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: categories.length,
        offset: params.offset,
        categories: categories.map((c) => ({
          id: c.category_no.toString(),
          name: c.category_name,
          depth: c.category_depth,
          parent_id: c.parent_category_no?.toString() || null,
        })),
        has_more: total > params.offset + categories.length,
        ...(total > params.offset + categories.length
          ? { next_offset: params.offset + categories.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_categories",
    {
      title: "List Cafe24 Product Categories",
      description:
        "Retrieve a list of product categories from Cafe24. Returns category details including category number, name, depth, and parent category. Supports pagination and filtering by parent category.",
      inputSchema: CategoriesSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_categories,
  );
}
