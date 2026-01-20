import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  ProductVariantDeleteParamsSchema,
  ProductVariantGetParamsSchema,
  ProductVariantsBulkUpdateParamsSchema,
  ProductVariantsListParamsSchema,
  ProductVariantUpdateParamsSchema,
} from "../schemas/product-variants.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

interface VariantOption {
  name: string;
  value: string;
}

interface Variant {
  shop_no: number;
  variant_code: string;
  options?: VariantOption[];
  custom_variant_code?: string;
  display?: string;
  selling?: string;
  additional_amount?: string;
  use_inventory?: string;
  important_inventory?: string;
  inventory_control_type?: string;
  display_soldout?: string;
  quantity?: number;
  safety_inventory?: number;
  image?: string;
  inventories?: Record<string, unknown>;
  duplicated_custom_variant_code?: string;
}

interface VariantsListResponse {
  variants: Variant[];
}

interface VariantResponse {
  variant: Variant;
}

interface VariantDeleteResponse {
  variant: {
    product_no: number;
    variant_code: string;
  };
}

async function cafe24_list_product_variants(
  params: z.infer<typeof ProductVariantsListParamsSchema>,
) {
  try {
    const { shop_no, product_no, embed } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const queryParams: Record<string, unknown> = {};
    if (embed && embed.length > 0) queryParams.embed = embed.join(",");

    const data = await makeApiRequest<VariantsListResponse>(
      `/admin/products/${product_no}/variants`,
      "GET",
      undefined,
      queryParams,
      requestHeaders,
    );

    const variants = data.variants || [];

    let content = `**Product #${product_no} Variants (${variants.length}):**\n\n`;
    for (const variant of variants) {
      const options = variant.options?.map((o) => `${o.name}: ${o.value}`).join(", ") || "N/A";
      content +=
        `### ${variant.variant_code}\n` +
        `- Options: ${options}\n` +
        `- Display: ${variant.display === "T" ? "Yes" : "No"}\n` +
        `- Selling: ${variant.selling === "T" ? "Yes" : "No"}\n` +
        `- Additional Amount: ${variant.additional_amount}\n` +
        `- Quantity: ${variant.quantity ?? "N/A"}\n` +
        `- Safety Inventory: ${variant.safety_inventory ?? "N/A"}\n\n`;
    }

    return {
      content: [{ type: "text" as const, text: content }],
      structuredContent: { variants } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_product_variant(params: z.infer<typeof ProductVariantGetParamsSchema>) {
  try {
    const { shop_no, product_no, variant_code, embed } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const queryParams: Record<string, unknown> = {};
    if (embed && embed.length > 0) queryParams.embed = embed.join(",");

    const data = await makeApiRequest<VariantResponse>(
      `/admin/products/${product_no}/variants/${variant_code}`,
      "GET",
      undefined,
      queryParams,
      requestHeaders,
    );

    const variant = data.variant;
    const options = variant.options?.map((o) => `${o.name}: ${o.value}`).join(", ") || "N/A";

    const content =
      `**Variant ${variant.variant_code}**\n\n` +
      `- Options: ${options}\n` +
      `- Custom Code: ${variant.custom_variant_code || "N/A"}\n` +
      `- Display: ${variant.display === "T" ? "Yes" : "No"}\n` +
      `- Selling: ${variant.selling === "T" ? "Yes" : "No"}\n` +
      `- Additional Amount: ${variant.additional_amount}\n` +
      `- Use Inventory: ${variant.use_inventory === "T" ? "Yes" : "No"}\n` +
      `- Quantity: ${variant.quantity ?? "N/A"}\n` +
      `- Safety Inventory: ${variant.safety_inventory ?? "N/A"}\n` +
      `- Inventory Control: ${variant.inventory_control_type === "A" ? "Upon order" : "Upon payment"}`;

    return {
      content: [{ type: "text" as const, text: content }],
      structuredContent: { variant } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product_variant(
  params: z.infer<typeof ProductVariantUpdateParamsSchema>,
) {
  try {
    const { shop_no, product_no, variant_code, ...updateData } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no: shop_no ?? 1,
      request: updateData,
    };

    const data = await makeApiRequest<VariantResponse>(
      `/admin/products/${product_no}/variants/${variant_code}`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    const variant = data.variant;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Updated variant ${variant.variant_code} for product #${product_no}\n` +
            `- Display: ${variant.display === "T" ? "Yes" : "No"}\n` +
            `- Selling: ${variant.selling === "T" ? "Yes" : "No"}\n` +
            `- Additional Amount: ${variant.additional_amount}`,
        },
      ],
      structuredContent: { variant } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_bulk_update_product_variants(
  params: z.infer<typeof ProductVariantsBulkUpdateParamsSchema>,
) {
  try {
    const { shop_no, product_no, requests } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no: shop_no ?? 1,
      requests,
    };

    const data = await makeApiRequest<VariantsListResponse>(
      `/admin/products/${product_no}/variants`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    const variants = data.variants || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Bulk updated ${variants.length} variant(s) for product #${product_no}\n\n` +
            variants.map((v) => `- ${v.variant_code}: Updated`).join("\n"),
        },
      ],
      structuredContent: { variants } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_product_variant(
  params: z.infer<typeof ProductVariantDeleteParamsSchema>,
) {
  try {
    const { shop_no, product_no, variant_code } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<VariantDeleteResponse>(
      `/admin/products/${product_no}/variants/${variant_code}`,
      "DELETE",
      undefined,
      undefined,
      requestHeaders,
    );

    const deletedCode = data.variant?.variant_code || variant_code;

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted variant ${deletedCode} from product #${product_no}`,
        },
      ],
      structuredContent: { variant: data.variant } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_product_variants",
    {
      title: "List Product Variants",
      description:
        "Retrieve all variants for a product including options, display/selling status, inventory, and pricing information.",
      inputSchema: ProductVariantsListParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_product_variants,
  );

  server.registerTool(
    "cafe24_get_product_variant",
    {
      title: "Get Product Variant",
      description: "Retrieve details of a specific product variant by variant code.",
      inputSchema: ProductVariantGetParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product_variant,
  );

  server.registerTool(
    "cafe24_update_product_variant",
    {
      title: "Update Product Variant",
      description:
        "Update a single product variant. Modify display, selling, inventory, pricing, and other settings.",
      inputSchema: ProductVariantUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product_variant,
  );

  server.registerTool(
    "cafe24_bulk_update_product_variants",
    {
      title: "Bulk Update Product Variants",
      description: "Update multiple product variants at once for the same product.",
      inputSchema: ProductVariantsBulkUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_bulk_update_product_variants,
  );

  server.registerTool(
    "cafe24_delete_product_variant",
    {
      title: "Delete Product Variant",
      description: "Delete a specific product variant by variant code.",
      inputSchema: ProductVariantDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_product_variant,
  );
}
