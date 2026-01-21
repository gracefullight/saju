import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  ProductApproveGetParamsSchema,
  ProductApproveRequestParamsSchema,
  ProductApproveUpdateParamsSchema,
  ProductCustomPropertiesDeleteParamsSchema,
  ProductCustomPropertiesGetParamsSchema,
  ProductCustomPropertiesUpdateParamsSchema,
} from "@/schemas/product.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

const statusMap: Record<string, string> = {
  N: "Approval Request (New)",
  E: "Approval Request (Edit)",
  C: "Approved",
  R: "Rejected",
  I: "Inspecting",
  "": "Never requested",
};

async function cafe24_get_product_approve(params: z.infer<typeof ProductApproveGetParamsSchema>) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{
      approve: { shop_no: number; status: string; product_no: number };
    }>(`/admin/products/${product_no}/approve`, "GET", undefined, { shop_no }, requestHeaders);

    const result =
      data.approve || ({} as { shop_no?: number; status?: string; product_no?: number });

    return {
      content: [
        {
          type: "text" as const,
          text: `Product ${result.product_no} approval status: ${statusMap[result.status] || result.status}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_request_product_approve(
  params: z.infer<typeof ProductApproveRequestParamsSchema>,
) {
  try {
    const { shop_no, product_no, user_id } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: { user_id },
    };

    const data = await makeApiRequest<{
      approve: { shop_no: number; status: string; product_no: number };
    }>(`/admin/products/${product_no}/approve`, "POST", payload, undefined, requestHeaders);

    const result =
      data.approve || ({} as { shop_no?: number; status?: string; product_no?: number });

    return {
      content: [
        {
          type: "text" as const,
          text: `Approval requested for product ${result.product_no} (status: ${result.status})`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product_approve(
  params: z.infer<typeof ProductApproveUpdateParamsSchema>,
) {
  try {
    const { shop_no, product_no, user_id, status } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: { user_id, status },
    };

    const data = await makeApiRequest<{
      approve: { shop_no: number; status: string; product_no: number };
    }>(`/admin/products/${product_no}/approve`, "PUT", payload, undefined, requestHeaders);

    const result =
      data.approve || ({} as { shop_no?: number; status?: string; product_no?: number });
    const statusMapDetailed: Record<string, string> = {
      C: "Approved",
      R: "Rejected",
      I: "Inspecting",
    };

    return {
      content: [
        {
          type: "text" as const,
          text: `Product ${result.product_no} approval updated: ${statusMapDetailed[result.status] || result.status}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_product_custom_properties(
  params: z.infer<typeof ProductCustomPropertiesGetParamsSchema>,
) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{
      products: {
        shop_no: number;
        custom_properties: { property_no: number; property_name: string; property_value: string }[];
      };
    }>(
      `/admin/products/${product_no}/customproperties`,
      "GET",
      undefined,
      { shop_no },
      requestHeaders,
    );

    const result =
      data.products ||
      ({} as {
        custom_properties?: {
          property_no: number;
          property_name: string;
          property_value: string;
        }[];
      });
    const properties = result.custom_properties || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${properties.length} custom properties for product ${product_no}\n\n` +
            properties
              .map((p) => `- [${p.property_no}] ${p.property_name}: ${p.property_value}`)
              .join("\n"),
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product_custom_property(
  params: z.infer<typeof ProductCustomPropertiesUpdateParamsSchema>,
) {
  try {
    const { shop_no, product_no, property_no, property_value } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: { property_value },
    };

    const data = await makeApiRequest<{
      product: {
        shop_no: number;
        custom_properties: { property_no: number; property_name: string; property_value: string }[];
      };
    }>(
      `/admin/products/${product_no}/customproperties/${property_no}`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    const result = data.product || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated custom property ${property_no} for product ${product_no}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_product_custom_property(
  params: z.infer<typeof ProductCustomPropertiesDeleteParamsSchema>,
) {
  try {
    const { shop_no, product_no, property_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{
      product: {
        shop_no: number;
        custom_properties: { property_no: number; property_name: string; property_value: string }[];
      };
    }>(
      `/admin/products/${product_no}/customproperties/${property_no}`,
      "DELETE",
      undefined,
      { shop_no },
      requestHeaders,
    );

    const result = data.product || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted custom property ${property_no} from product ${product_no}`,
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
    "cafe24_get_product_approve",
    {
      title: "Get Product Approval Status",
      description: "Retrieve the approval status of a product.",
      inputSchema: ProductApproveGetParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product_approve,
  );

  server.registerTool(
    "cafe24_request_product_approve",
    {
      title: "Request Product Approval",
      description: "Request approval for a product from a supplier.",
      inputSchema: ProductApproveRequestParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_request_product_approve,
  );

  server.registerTool(
    "cafe24_update_product_approve",
    {
      title: "Update Product Approval",
      description:
        "Update the approval status of a product (C: Approved, R: Rejected, I: Inspecting).",
      inputSchema: ProductApproveUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product_approve,
  );

  server.registerTool(
    "cafe24_get_product_custom_properties",
    {
      title: "Get Product Custom Properties",
      description: "Retrieve custom properties of a product.",
      inputSchema: ProductCustomPropertiesGetParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product_custom_properties,
  );

  server.registerTool(
    "cafe24_update_product_custom_property",
    {
      title: "Update Product Custom Property",
      description: "Update a custom property value for a product.",
      inputSchema: ProductCustomPropertiesUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product_custom_property,
  );

  server.registerTool(
    "cafe24_delete_product_custom_property",
    {
      title: "Delete Product Custom Property",
      description: "Delete (clear) a custom property value from a product.",
      inputSchema: ProductCustomPropertiesDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_product_custom_property,
  );
}
