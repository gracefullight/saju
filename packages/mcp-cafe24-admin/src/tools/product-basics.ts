import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  ProductCountParamsSchema,
  ProductCreateParamsSchema,
  ProductDeleteParamsSchema,
  ProductDetailParamsSchema,
  ProductsSearchParamsSchema,
  ProductUpdateParamsSchema,
} from "../schemas/product.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { Product } from "../types/product.js";

async function cafe24_count_products(params: z.infer<typeof ProductCountParamsSchema>) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const apiQueryParams = buildProductSearchParams(queryParams);

    const data = await makeApiRequest<{ count: number }>(
      "/admin/products/count",
      "GET",
      undefined,
      apiQueryParams,
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${data.count} products`,
        },
      ],
      structuredContent: { count: data.count },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_products(params: z.infer<typeof ProductsSearchParamsSchema>) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const apiQueryParams = buildProductSearchParams(queryParams);

    const data = await makeApiRequest<{ products: Product[]; total: number }>(
      "/admin/products",
      "GET",
      undefined,
      apiQueryParams,
      requestHeaders,
    );
    const products = data.products || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} products (showing ${products.length})\n\n` +
            products.map(formatProductListItem).join(""),
        },
      ],
      structuredContent: {
        count: products.length,
        offset: params.offset,
        products,
        has_more: products.length === params.limit,
        ...(products.length === params.limit
          ? { next_offset: params.offset + products.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

function buildProductSearchParams(
  params: z.infer<typeof ProductsSearchParamsSchema> | z.infer<typeof ProductCountParamsSchema>,
): Record<string, unknown> {
  const apiQueryParams: Record<string, unknown> = {};

  const fields = [
    "product_no",
    "product_code",
    "custom_product_code",
    "custom_variant_code",
    "product_name",
    "eng_product_name",
    "supply_product_name",
    "internal_product_name",
    "model_name",
    "product_tag",
    "brand_code",
    "manufacturer_code",
    "supplier_code",
    "trend_code",
    "product_condition",
    "display",
    "selling",
    "product_bundle",
    "option_type",
    "price_min",
    "price_max",
    "retail_price_min",
    "retail_price_max",
    "supply_price_min",
    "supply_price_max",
    "stock_quantity_min",
    "stock_quantity_max",
    "stock_safety_min",
    "stock_safety_max",
    "product_weight",
    "created_start_date",
    "created_end_date",
    "updated_start_date",
    "updated_end_date",
    "category",
    "classification_code",
    "use_inventory",
    "category_unapplied",
    "include_sub_category",
    "additional_information_key",
    "additional_information_value",
    "approve_status",
    "origin_place_value",
    "market_sync",
    "since_product_no",
    "sort",
    "order",
  ];

  if ("embed" in params && params.embed?.length) {
    apiQueryParams.embed = params.embed.join(",");
  }

  for (const field of fields) {
    if ((params as Record<string, unknown>)[field] !== undefined) {
      apiQueryParams[field] = (params as Record<string, unknown>)[field];
    }
  }

  return apiQueryParams;
}

function formatProductListItem(p: Product): string {
  return (
    `## ${p.product_name} (${p.product_no})\n` +
    `- **Code**: ${p.product_code}\n` +
    `- **Price**: ${p.price}\n` +
    `- **Display**: ${p.display === "T" ? "Yes" : "No"}\n` +
    `- **Selling**: ${p.selling === "T" ? "Yes" : "No"}\n`
  );
}

async function cafe24_get_product(params: z.infer<typeof ProductDetailParamsSchema>) {
  try {
    const { shop_no, product_no, embed } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const queryParams: Record<string, unknown> = {};
    if (embed?.length) queryParams.embed = embed.join(",");

    const data = await makeApiRequest<{ product: Product }>(
      `/admin/products/${product_no}`,
      "GET",
      undefined,
      queryParams,
      requestHeaders,
    );
    const product = (data.product || {}) as unknown as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Product Details\n\n` +
            `- **Product No**: ${product.product_no}\n` +
            `- **Name**: ${product.product_name}\n` +
            `- **Code**: ${product.product_code}\n` +
            `- **Price**: ${product.price}\n` +
            `- **Retail Price**: ${product.retail_price}\n` +
            `- **Supply Price**: ${product.supply_price}\n` +
            `- **Display**: ${product.display === "T" ? "Yes" : "No"}\n` +
            `- **Selling**: ${product.selling === "T" ? "Yes" : "No"}\n` +
            `- **Sold Out**: ${product.sold_out === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: product,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_product(params: z.infer<typeof ProductCreateParamsSchema>) {
  try {
    const { shop_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest<{ product: Product }>(
      "/admin/products",
      "POST",
      payload,
      undefined,
      requestHeaders,
    );
    const product = (data.product || {}) as unknown as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text: `Product created: ${product.product_name} (No: ${product.product_no}, Code: ${product.product_code})`,
        },
      ],
      structuredContent: product,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product(params: z.infer<typeof ProductUpdateParamsSchema>) {
  try {
    const { shop_no, product_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest<{ product: Product }>(
      `/admin/products/${product_no}`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );
    const product = (data.product || {}) as unknown as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text: `Product updated: ${product.product_name} (No: ${product.product_no})`,
        },
      ],
      structuredContent: product,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_product(params: z.infer<typeof ProductDeleteParamsSchema>) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{ product: { product_no: number } }>(
      `/admin/products/${product_no}`,
      "DELETE",
      undefined,
      undefined,
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Product ${data.product?.product_no || product_no} deleted successfully`,
        },
      ],
      structuredContent: { product_no: data.product?.product_no || product_no },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_products",
    {
      title: "List Cafe24 Products",
      description:
        "Retrieve a list of products from Cafe24. Returns product details including product number, name, code, price, stock, and status. Supports extensive filtering by product number, code, category, price range, selling status, and display status. Paginated results.",
      inputSchema: ProductsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_products,
  );

  server.registerTool(
    "cafe24_count_products",
    {
      title: "Count Cafe24 Products",
      description:
        "Get the count of products matching the specified filters. Supports all product search filters.",
      inputSchema: ProductCountParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_products,
  );

  server.registerTool(
    "cafe24_get_product",
    {
      title: "Get Cafe24 Product Details",
      description:
        "Retrieve detailed information about a specific product by product number. Returns complete product details including name, code, price, stock, description, selling status, display status, and dates.",
      inputSchema: ProductDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product,
  );

  server.registerTool(
    "cafe24_create_product",
    {
      title: "Create Cafe24 Product",
      description:
        "Create a new product in Cafe24. Requires product name and price. Optionally includes product code, stock quantity, descriptions, selling status, and display status.",
      inputSchema: ProductCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_product,
  );

  server.registerTool(
    "cafe24_update_product",
    {
      title: "Update Cafe24 Product",
      description:
        "Update an existing product in Cafe24 by product number. Only provided fields will be updated.",
      inputSchema: ProductUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product,
  );

  server.registerTool(
    "cafe24_delete_product",
    {
      title: "Delete Cafe24 Product",
      description: "Delete a product from Cafe24 by product number. This action cannot be undone.",
      inputSchema: ProductDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_product,
  );
}
