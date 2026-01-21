import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  ProductDiscountPriceParamsSchema,
  ProductHitsCountParamsSchema,
  ProductIconsCreateUpdateParamsSchema,
  ProductIconsDeleteParamsSchema,
  ProductIconsGetParamsSchema,
} from "@/schemas/product.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { ProductDiscountPrice, ProductIcons } from "@/types/product.js";

async function cafe24_get_product_discount_price(
  params: z.infer<typeof ProductDiscountPriceParamsSchema>,
) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{
      discountprice: ProductDiscountPrice;
    }>(
      `/admin/products/${product_no}/discountprice`,
      "GET",
      undefined,
      { shop_no },
      requestHeaders,
    );

    const result = data.discountprice || ({} as ProductDiscountPrice);

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Discount prices for product ${product_no}\n` +
            `- PC: ${result.pc_discount_price}\n` +
            `- Mobile: ${result.mobile_discount_price}\n` +
            `- App: ${result.app_discount_price}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_product_hits_count(params: z.infer<typeof ProductHitsCountParamsSchema>) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{ count: number }>(
      `/admin/products/${product_no}/hits/count`,
      "GET",
      undefined,
      { shop_no },
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Product ${product_no} hit count: ${data.count}`,
        },
      ],
      structuredContent: { count: data.count },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_product_icons(params: z.infer<typeof ProductIconsGetParamsSchema>) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{ icons: ProductIcons }>(
      `/admin/products/${product_no}/icons`,
      "GET",
      undefined,
      { shop_no },
      requestHeaders,
    );

    const result = data.icons || ({} as ProductIcons);
    const images = result.image_list || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Icons for product ${product_no}\n` +
            `Show date: ${result.use_show_date === "T" ? "Enabled" : "Disabled"}\n` +
            `Period: ${result.show_start_date || "N/A"} ~ ${result.show_end_date || "N/A"}\n\n` +
            images.map((img) => `- Code: ${img.code}, Path: ${img.path}`).join("\n"),
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_product_icons(
  params: z.infer<typeof ProductIconsCreateUpdateParamsSchema>,
) {
  try {
    const { shop_no, product_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest<{ icon: ProductIcons }>(
      `/admin/products/${product_no}/icons`,
      "POST",
      payload,
      undefined,
      requestHeaders,
    );

    const result = data.icon || ({} as ProductIcons);

    return {
      content: [
        {
          type: "text" as const,
          text: `Created icons for product ${product_no}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product_icons(
  params: z.infer<typeof ProductIconsCreateUpdateParamsSchema>,
) {
  try {
    const { shop_no, product_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest<{ icon: ProductIcons }>(
      `/admin/products/${product_no}/icons`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    const result = data.icon || ({} as ProductIcons);

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated icons for product ${product_no}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_product_icon(params: z.infer<typeof ProductIconsDeleteParamsSchema>) {
  try {
    const { shop_no, product_no, code } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{ icon: { shop_no: number; code: string } }>(
      `/admin/products/${product_no}/icons/${code}`,
      "DELETE",
      undefined,
      { shop_no },
      requestHeaders,
    );

    const result = data.icon || ({} as { code?: string });

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted icon ${result.code || code} from product ${product_no}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_product_discount_price",
    {
      title: "Get Product Discount Price",
      description: "Retrieve discount price information for a product (PC, Mobile, App).",
      inputSchema: ProductDiscountPriceParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product_discount_price,
  );

  server.registerTool(
    "cafe24_get_product_hits_count",
    {
      title: "Get Product Hits Count",
      description: "Retrieve the hit count for a specific product.",
      inputSchema: ProductHitsCountParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product_hits_count,
  );

  server.registerTool(
    "cafe24_get_product_icons",
    {
      title: "Get Product Icons",
      description: "Retrieve icon settings and list for a product.",
      inputSchema: ProductIconsGetParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product_icons,
  );

  server.registerTool(
    "cafe24_create_product_icons",
    {
      title: "Create Product Icons",
      description: "Set icons for a product. Max 5 icons.",
      inputSchema: ProductIconsCreateUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_product_icons,
  );

  server.registerTool(
    "cafe24_update_product_icons",
    {
      title: "Update Product Icons",
      description: "Update icon settings and list for a product.",
      inputSchema: ProductIconsCreateUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product_icons,
  );

  server.registerTool(
    "cafe24_delete_product_icon",
    {
      title: "Delete Product Icon",
      description: "Delete a specific icon from a product.",
      inputSchema: ProductIconsDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_product_icon,
  );
}
