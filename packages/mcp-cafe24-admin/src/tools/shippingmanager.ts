import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type ShippingManagerParams,
  ShippingManagerParamsSchema,
} from "@/schemas/shippingmanager.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { ShippingManagerStatus } from "@/types/index.js";

async function cafe24_get_shippingmanager_status(params: ShippingManagerParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/shippingmanager", "GET", undefined, queryParams);
    const responseData = data as
      | { shippingmanager?: Record<string, unknown> }
      | Record<string, unknown>;
    const status = (responseData.shippingmanager || {}) as ShippingManagerStatus;

    return {
      content: [
        {
          type: "text" as const,
          text: `Shipping Manager Status: ${status.use === "T" ? "Enabled" : "Disabled"}`,
        },
      ],
      structuredContent: {
        use: status.use,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_shippingmanager_status",
    {
      title: "Get Cafe24 Shipping Manager Status",
      description: "Retrieve the activation status of the Shipping Manager service.",
      inputSchema: ShippingManagerParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_shippingmanager_status,
  );
}
