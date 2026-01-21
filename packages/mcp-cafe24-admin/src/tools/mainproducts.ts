import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type AddMainProductsParams,
  AddMainProductsParamsSchema,
  type CountMainProductsParams,
  CountMainProductsParamsSchema,
  type DeleteMainProductParams,
  DeleteMainProductParamsSchema,
  type ListMainProductsParams,
  ListMainProductsParamsSchema,
  type UpdateMainProductsParams,
  UpdateMainProductsParamsSchema,
} from "@/schemas/mainproducts.js";
import type { MainProduct, MainProductOperationResult } from "@/types/index.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_main_products(params: ListMainProductsParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest(
      `/admin/mains/${params.display_group}/products`,
      "GET",
      undefined,
      queryParams,
    );

    const responseData = data as { products?: MainProduct[] } | { products?: MainProduct[] };
    const products: MainProduct[] = responseData.products || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Main Products (Group: ${params.display_group}, Shop: ${params.shop_no || 1})\n\n` +
            (products.length > 0
              ? products
                  .map(
                    (p) =>
                      `- [${p.product_no}] ${p.product_name} (Fixed: ${p.fixed_sort ? "Yes" : "No"})`,
                  )
                  .join("\n")
              : "No products found."),
        },
      ],
      structuredContent: products as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_main_products(params: CountMainProductsParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest(
      `/admin/mains/${params.display_group}/products/count`,
      "GET",
      undefined,
      queryParams,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Main Product Count (Group: ${params.display_group}, Shop: ${
            params.shop_no || 1
          }): ${(data as { count: number }).count ?? 0}`,
        },
      ],
      structuredContent: { count: (data as { count: number }).count } as unknown as Record<
        string,
        unknown
      >,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_add_main_products(params: AddMainProductsParams) {
  try {
    const requestBody = {
      shop_no: params.shop_no || 1,
      request: {
        product_no: params.product_no,
      },
    };

    const data = await makeApiRequest(
      `/admin/mains/${params.display_group}/products`,
      "POST",
      requestBody,
    );

    const responseData = data as
      | { product?: MainProductOperationResult }
      | MainProductOperationResult;
    const result: MainProductOperationResult =
      "product" in responseData
        ? (responseData as { product: MainProductOperationResult }).product
        : (responseData as MainProductOperationResult);

    return {
      content: [
        {
          type: "text" as const,
          text: `Added products to Main Group ${params.display_group} (Shop: ${result.shop_no}).\nAPI Response Product IDs: ${JSON.stringify(result.product_no)}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_main_products(params: UpdateMainProductsParams) {
  try {
    const requestBody = {
      shop_no: params.shop_no || 1,
      request: {
        product_no: params.product_no,
        fix_product_no: params.fix_product_no,
      },
    };

    const data = await makeApiRequest(
      `/admin/mains/${params.display_group}/products`,
      "PUT",
      requestBody,
    );

    const responseData = data as
      | { product?: MainProductOperationResult }
      | MainProductOperationResult;
    const result: MainProductOperationResult =
      "product" in responseData
        ? (responseData as { product: MainProductOperationResult }).product
        : (responseData as MainProductOperationResult);

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated products in Main Group ${params.display_group} (Shop: ${result.shop_no}).\nAPI Response Product IDs: ${JSON.stringify(result.product_no)}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_main_product(params: DeleteMainProductParams) {
  try {
    // Note: DELETE body is ignored by many clients but Cafe24 example implies "product_no" in path BUT shows JSON response with product info.
    // However, usually DELETE endpoints in Cafe24 might accept querying params but the example shows a path param for product_no.
    // The example provided by user:
    // DELETE 'https://{mallid}.cafe24api.com/api/v2/admin/mains/2/products/7'
    // So distinct URL.
    // Query params for shop_no? Example says parameter shop_no Default 1.
    // Usually Cafe24 accepts it as query param for GET/DELETE or Body for POST/PUT.
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest(
      `/admin/mains/${params.display_group}/products/${params.product_no}`,
      "DELETE",
      undefined,
      queryParams,
    );

    const responseData = data as
      | { product?: MainProductOperationResult }
      | MainProductOperationResult;
    const result: MainProductOperationResult =
      "product" in responseData
        ? (responseData as { product: MainProductOperationResult }).product
        : (responseData as MainProductOperationResult);

    return {
      content: [
        {
          type: "text" as const,
          text: `Removed product ${params.product_no} from Main Group ${params.display_group} (Shop: ${result.shop_no}).`,
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
    "cafe24_list_main_products",
    {
      title: "List Main Products",
      description: "List products displayed in a specific main display group.",
      inputSchema: ListMainProductsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_main_products,
  );

  server.registerTool(
    "cafe24_count_main_products",
    {
      title: "Count Main Products",
      description: "Get the count of products in a specific main display group.",
      inputSchema: CountMainProductsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_main_products,
  );

  server.registerTool(
    "cafe24_add_main_products",
    {
      title: "Add Main Products",
      description: "Add products to a specific main display group.",
      inputSchema: AddMainProductsParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_add_main_products,
  );

  server.registerTool(
    "cafe24_update_main_products",
    {
      title: "Update Main Products",
      description: "Update the list and order of products in a main display group.",
      inputSchema: UpdateMainProductsParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_main_products,
  );

  server.registerTool(
    "cafe24_delete_main_product",
    {
      title: "Delete Main Product",
      description: "Remove a product from a specific main display group.",
      inputSchema: DeleteMainProductParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_main_product,
  );
}
