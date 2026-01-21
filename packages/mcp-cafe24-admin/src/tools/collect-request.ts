import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import { CollectRequestUpdateParamsSchema } from "@/schemas/collect-request.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { CollectRequest } from "@/types/index.js";

async function cafe24_update_collect_request(
  params: z.infer<typeof CollectRequestUpdateParamsSchema>,
) {
  try {
    const data = await makeApiRequest<{ collectrequest: CollectRequest }>(
      `/admin/collectrequests/${params.request_no}`,
      "PUT",
      {
        shop_no: params.shop_no,
        request: params.request,
      },
    );
    const collectRequest = data.collectrequest;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated collect request #${collectRequest.request_no} for order ${collectRequest.order_id}. Tracking No: ${collectRequest.collect_tracking_no}`,
        },
      ],
      structuredContent: {
        collectRequest,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_update_collect_request",
    {
      title: "Update Cafe24 Collect Request",
      description:
        "Update the collection tracking number for a return/exchange collection request in Cafe24.",
      inputSchema: CollectRequestUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_collect_request,
  );
}
