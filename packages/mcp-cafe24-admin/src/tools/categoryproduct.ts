import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { CategoryProduct } from "@/types/index.js";
import {
  AddCategoryProductsSchema,
  CountCategoryProductsSchema,
  ListCategoryProductsSchema,
  RemoveCategoryProductSchema,
  UpdateCategoryProductSchema,
} from "@/schemas/categoryproduct.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

async function cafe24_list_category_products(params: z.infer<typeof ListCategoryProductsSchema>) {
  try {
    const { category_no, shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest(
      `/admin/categories/${category_no}/products`,
      "GET",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    const responseData = data as
      | { products?: CategoryProduct[] }
      | { products?: CategoryProduct[] };
    const products = responseData.products || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${products.length} products in category ${category_no}.\n\n` +
            products
              .map(
                (p: CategoryProduct) =>
                  `- Product No: ${p.product_no}\n` +
                  `  Shop No: ${p.shop_no}\n` +
                  `  Sequence: ${p.sequence_no}\n` +
                  `  Auto Sort: ${p.auto_sort ? "Yes" : "No"}\n` +
                  `  Sold Out: ${p.sold_out ? "Yes" : "No"}\n` +
                  `  Fixed Sort: ${p.fixed_sort ? "Yes" : "No"}\n` +
                  `  Not For Sale: ${p.not_for_sale ? "Yes" : "No"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        products,
        meta: {
          count: products.length,
          category_no,
        },
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_category_products(params: z.infer<typeof CountCategoryProductsSchema>) {
  try {
    const { category_no, shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest(
      `/admin/categories/${category_no}/products/count`,
      "GET",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Product count in category ${category_no}: ${(data as { count: number }).count}`,
        },
      ],
      structuredContent: {
        count: (data as { count: number }).count,
        category_no,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_add_category_products(params: z.infer<typeof AddCategoryProductsSchema>) {
  try {
    const { category_no, shop_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      request: requestBody,
    };

    const data = await makeApiRequest(
      `/admin/categories/${category_no}/products`,
      "POST",
      payload,
      undefined,
      requestHeaders,
    );

    const responseData = data as { product?: Record<string, unknown> };
    const result = (responseData.product || {}) as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text: `Added products to category ${category_no}: ${(result.product_no as number[] | undefined)?.join(", ")} (Display Group: ${result.display_group})`,
        },
      ],
      structuredContent: result,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_category_product(params: z.infer<typeof UpdateCategoryProductSchema>) {
  try {
    const { category_no, shop_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest(
      `/admin/categories/${category_no}/products`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    const responseData = data as { product?: Record<string, unknown> };
    const result = (responseData.product || {}) as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated product ${result.product_no} in category ${category_no}. Sequence: ${result.sequence}`,
        },
      ],
      structuredContent: result,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_remove_category_product(params: z.infer<typeof RemoveCategoryProductSchema>) {
  try {
    const { category_no, product_no, shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest(
      `/admin/categories/${category_no}/products/${product_no}`,
      "DELETE",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    const responseData = data as { product?: Record<string, unknown> };
    const result = (responseData.product || {}) as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text: `Removed product ${result.product_no} from category ${category_no} (Display Group: ${result.display_group})`,
        },
      ],
      structuredContent: result,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_category_products",
    {
      title: "List Category Products",
      description: "List products in a specific category",
      inputSchema: ListCategoryProductsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_category_products,
  );

  server.registerTool(
    "cafe24_count_category_products",
    {
      title: "Count Category Products",
      description: "Count products in a specific category",
      inputSchema: CountCategoryProductsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_category_products,
  );

  server.registerTool(
    "cafe24_add_category_products",
    {
      title: "Add Category Products",
      description: "Add products to a category",
      inputSchema: AddCategoryProductsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_add_category_products,
  );

  server.registerTool(
    "cafe24_update_category_product",
    {
      title: "Update Category Product",
      description: "Update product display settings in a category",
      inputSchema: UpdateCategoryProductSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_update_category_product,
  );

  server.registerTool(
    "cafe24_remove_category_product",
    {
      title: "Remove Category Product",
      description: "Remove a product from a category",
      inputSchema: RemoveCategoryProductSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_remove_category_product,
  );
}
