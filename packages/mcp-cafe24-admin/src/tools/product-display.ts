import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  ProductDisplaySettingParamsSchema,
  ProductDisplaySettingUpdateParamsSchema,
} from "../schemas/productdisplay.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_get_product_display_setting(
  params: z.infer<typeof ProductDisplaySettingParamsSchema>,
) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest(
      "/admin/products/display/setting",
      "GET",
      undefined,
      queryParams,
    );
    const responseData = data as { product?: Record<string, unknown> } | Record<string, unknown>;
    const product = (responseData.product || responseData) as Record<string, unknown>;

    const sortLabels: Record<string, string> = {
      new_product: "New Product",
      product_name: "Product Name",
      low_price: "Lowest Price",
      high_price: "Highest Price",
      manufacture: "Manufacturer",
      popular_product: "Popular Product",
      review: "Reviews",
      hit_count: "View Count",
      like_count: "Likes",
    };

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Product Display Settings (Shop #${product.shop_no || 1})\n\n` +
            `### Sorting Options\n` +
            ((product.sorting_options as string[]) || [])
              .map((opt: string) => `- ${sortLabels[opt] || opt}`)
              .join("\n") +
            "\n",
        },
      ],
      structuredContent: {
        shop_no: product.shop_no ?? 1,
        sorting_options: product.sorting_options,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product_display_setting(
  params: z.infer<typeof ProductDisplaySettingUpdateParamsSchema>,
) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/products/display/setting", "PUT", requestBody);
    const responseData = data as { product?: Record<string, unknown> } | Record<string, unknown>;
    const product = (responseData.product || responseData) as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Product Display Settings Updated (Shop #${product.shop_no || 1})\n\n` +
            `### Sorting Options\n` +
            ((product.sorting_options as string[]) || [])
              .map((opt: string) => `- ${opt}`)
              .join("\n") +
            "\n",
        },
      ],
      structuredContent: {
        shop_no: product.shop_no ?? 1,
        sorting_options: product.sorting_options,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_product_display_setting",
    {
      title: "Get Cafe24 Product Display Settings",
      description: "Retrieve product sorting options available in the shop.",
      inputSchema: ProductDisplaySettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product_display_setting,
  );

  server.registerTool(
    "cafe24_update_product_display_setting",
    {
      title: "Update Cafe24 Product Display Settings",
      description:
        "Update product sorting options. Available options: new_product, product_name, low_price, high_price, manufacture, popular_product, review, hit_count, like_count.",
      inputSchema: ProductDisplaySettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product_display_setting,
  );
}
