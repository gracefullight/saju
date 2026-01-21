import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  VariantInventoryGetParamsSchema,
  VariantInventoryUpdateParamsSchema,
} from "@/schemas/product-inventories.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

interface VariantInventory {
  shop_no: number;
  variant_code: string;
  use_inventory?: string;
  important_inventory?: string;
  inventory_control_type?: string;
  display_soldout?: string;
  quantity?: number;
  safety_inventory?: number;
  origin_code?: string;
}

interface VariantInventoryResponse {
  inventory: VariantInventory;
}

async function cafe24_get_variant_inventory(
  params: z.infer<typeof VariantInventoryGetParamsSchema>,
) {
  try {
    const { shop_no, product_no, variant_code } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<VariantInventoryResponse>(
      `/admin/products/${product_no}/variants/${variant_code}/inventories`,
      "GET",
      undefined,
      undefined,
      requestHeaders,
    );

    const inventory = data.inventory;

    const content =
      `**Inventory for Variant ${inventory.variant_code}**\n\n` +
      `- **Use Inventory**: ${inventory.use_inventory === "T" ? "Yes" : "No"}\n` +
      `- **Important Inventory**: ${inventory.important_inventory === "A" ? "General" : "Important"}\n` +
      `- **Inventory Control**: ${inventory.inventory_control_type === "A" ? "Upon order" : "Upon payment"}\n` +
      `- **Display Soldout**: ${inventory.display_soldout === "T" ? "Yes" : "No"}\n` +
      `- **Quantity**: ${inventory.quantity ?? 0}\n` +
      `- **Safety Inventory**: ${inventory.safety_inventory ?? 0}\n` +
      `- **Origin Code**: ${inventory.origin_code || "N/A"}`;

    return {
      content: [{ type: "text" as const, text: content }],
      structuredContent: { inventory } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_variant_inventory(
  params: z.infer<typeof VariantInventoryUpdateParamsSchema>,
) {
  try {
    const { shop_no, product_no, variant_code, ...inventoryData } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no: shop_no ?? 1,
      request: inventoryData,
    };

    const data = await makeApiRequest<VariantInventoryResponse>(
      `/admin/products/${product_no}/variants/${variant_code}/inventories`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    const inventory = data.inventory;

    const content =
      `**Updated Inventory for Variant ${inventory.variant_code}**\n\n` +
      `- **Use Inventory**: ${inventory.use_inventory === "T" ? "Yes" : "No"}\n` +
      `- **Important Inventory**: ${inventory.important_inventory === "A" ? "General" : "Important"}\n` +
      `- **Inventory Control**: ${inventory.inventory_control_type === "A" ? "Upon order" : "Upon payment"}\n` +
      `- **Display Soldout**: ${inventory.display_soldout === "T" ? "Yes" : "No"}\n` +
      `- **Quantity**: ${inventory.quantity ?? 0}\n` +
      `- **Safety Inventory**: ${inventory.safety_inventory ?? 0}\n` +
      `- **Origin Code**: ${inventory.origin_code || "N/A"}`;

    return {
      content: [{ type: "text" as const, text: content }],
      structuredContent: { inventory } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_variant_inventory",
    {
      title: "Get Variant Inventory",
      description:
        "Retrieve inventory information for a specific product variant including quantity, safety stock, and inventory control settings.",
      inputSchema: VariantInventoryGetParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_variant_inventory,
  );

  server.registerTool(
    "cafe24_update_variant_inventory",
    {
      title: "Update Variant Inventory",
      description:
        "Update inventory settings for a product variant. Manage quantity, safety stock, inventory control type, and soldout display.",
      inputSchema: VariantInventoryUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_variant_inventory,
  );
}
