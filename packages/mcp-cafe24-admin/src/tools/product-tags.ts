import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  ProductTagDeleteParamsSchema,
  ProductTagsCreateParamsSchema,
  ProductTagsGetParamsSchema,
} from "@/schemas/product-tags.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

interface ProductTagsListResponse {
  tags: {
    shop_no: number;
    tags: string[];
  };
}

interface ProductTagsCountResponse {
  count: number;
}

interface ProductTagCreateResponse {
  tag: {
    shop_no: number;
    product_no: number;
    tags: string[];
  };
}

interface ProductTagDeleteResponse {
  tag: {
    shop_no: number;
    product_no: number;
    tag: string;
  };
}

async function cafe24_count_product_tags(params: z.infer<typeof ProductTagsGetParamsSchema>) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<ProductTagsCountResponse>(
      `/admin/products/${product_no}/tags/count`,
      "GET",
      undefined,
      undefined,
      requestHeaders,
    );

    const count = data.count || 0;

    return {
      content: [
        {
          type: "text" as const,
          text: `Product #${product_no} has ${count} tag(s)`,
        },
      ],
      structuredContent: { count } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_product_tags(params: z.infer<typeof ProductTagsGetParamsSchema>) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<ProductTagsListResponse>(
      `/admin/products/${product_no}/tags`,
      "GET",
      undefined,
      undefined,
      requestHeaders,
    );

    const tags = data.tags?.tags || [];

    const content =
      tags.length > 0
        ? `**Product #${product_no} Tags (${tags.length}):**\n\n${tags.map((tag) => `- ${tag}`).join("\n")}`
        : `No tags found for product #${product_no}`;

    return {
      content: [{ type: "text" as const, text: content }],
      structuredContent: { tags: data.tags } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_product_tags(params: z.infer<typeof ProductTagsCreateParamsSchema>) {
  try {
    const { shop_no, product_no, tags } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no: shop_no ?? 1,
      request: { tags },
    };

    const data = await makeApiRequest<ProductTagCreateResponse>(
      `/admin/products/${product_no}/tags`,
      "POST",
      payload,
      undefined,
      requestHeaders,
    );

    const createdTags = data.tag?.tags || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Created ${createdTags.length} tag(s) for product #${product_no}:\n\n` +
            createdTags.map((tag) => `- ${tag}`).join("\n"),
        },
      ],
      structuredContent: { tag: data.tag } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_product_tag(params: z.infer<typeof ProductTagDeleteParamsSchema>) {
  try {
    const { shop_no, product_no, tag } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<ProductTagDeleteResponse>(
      `/admin/products/${product_no}/tags/${encodeURIComponent(tag)}`,
      "DELETE",
      undefined,
      undefined,
      requestHeaders,
    );

    const deletedTag = data.tag?.tag || tag;

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted tag "${deletedTag}" from product #${product_no}`,
        },
      ],
      structuredContent: { tag: data.tag } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_count_product_tags",
    {
      title: "Count Product Tags",
      description: "Get the count of tags for a product.",
      inputSchema: ProductTagsGetParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_product_tags,
  );

  server.registerTool(
    "cafe24_list_product_tags",
    {
      title: "List Product Tags",
      description: "Retrieve all tags for a product.",
      inputSchema: ProductTagsGetParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_product_tags,
  );

  server.registerTool(
    "cafe24_create_product_tags",
    {
      title: "Create Product Tags",
      description: "Add tags to a product. Maximum 100 tags can be added at once.",
      inputSchema: ProductTagsCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_product_tags,
  );

  server.registerTool(
    "cafe24_delete_product_tag",
    {
      title: "Delete Product Tag",
      description: "Delete a specific tag from a product.",
      inputSchema: ProductTagDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_product_tag,
  );
}
