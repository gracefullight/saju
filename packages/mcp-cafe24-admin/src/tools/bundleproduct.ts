import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type BundleProductComponent,
  type BundleProductSearchParams,
  BundleProductSearchParamsSchema,
  type CreateBundleProduct,
  CreateBundleProductSchema,
} from "@/schemas/bundleproduct.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { BundleProduct } from "@/types/index.js";

async function cafe24_list_bundle_products(params: BundleProductSearchParams) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{ bundleproducts: BundleProduct[] }>(
      "/admin/bundleproducts",
      "GET",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    const products = data.bundleproducts || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${products.length} bundle products.\n\n` +
            products
              .map(
                (p) =>
                  `## ${p.product_name} (${p.product_code})\n` +
                  `- No: ${p.product_no}\n` +
                  `- Display: ${p.display === "T" ? "Yes" : "No"}\n` +
                  `- Selling: ${p.selling === "T" ? "Yes" : "No"}\n` +
                  `- Price Content: ${p.price_content || "N/A"}\n` +
                  `- Components: ${
                    p.bundle_product_components
                      ? p.bundle_product_components
                          .map(
                            (c: BundleProductComponent) =>
                              `${c.product_name} x${c.purchase_quantity}`,
                          )
                          .join(", ")
                      : "None"
                  }\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        products,
        meta: {
          count: products.length,
        },
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_bundle_product(params: CreateBundleProduct) {
  try {
    const { shop_no, ...requestBody } = params;

    // The API expects 'shop_no' and 'request' object in the body
    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest<{ bundleproduct: BundleProduct }>(
      "/admin/bundleproducts",
      "POST",
      payload,
    );
    const product = data.bundleproduct || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Created bundle product: ${product.product_name} (No: ${product.product_no}, Code: ${product.product_code})`,
        },
      ],
      structuredContent: product as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_bundle_products",
    {
      title: "List Cafe24 Bundle Products",
      description:
        "Retrieve a list of bundle products from Cafe24. Supports filtering by date, price, status, and various other criteria.",
      inputSchema: BundleProductSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_bundle_products,
  );

  server.registerTool(
    "cafe24_create_bundle_product",
    {
      title: "Create Cafe24 Bundle Product",
      description: "Create a new bundle product in Cafe24.",
      inputSchema: CreateBundleProductSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_create_bundle_product,
  );
}
