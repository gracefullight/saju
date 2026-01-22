import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type RetrieveAutomails,
  RetrieveAutomailsSchema,
  type UpdateAutomails,
  UpdateAutomailsSchema,
} from "@/schemas/automails.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { AutomailListResponse } from "@/types/index.js";

async function cafe24_list_automails(params: RetrieveAutomails) {
  try {
    const { shop_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<AutomailListResponse>(
      "/admin/automails",
      "GET",
      undefined,
      { shop_no },
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(data.automails, null, 2),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_automails(params: UpdateAutomails) {
  try {
    const { shop_no, requests } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<AutomailListResponse>(
      "/admin/automails",
      "PUT",
      { shop_no, requests },
      undefined,
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated ${requests.length} automail settings for shop ${shop_no}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_automails",
    {
      title: "List Automails",
      description: "Retrieve a list of automated email settings.",
      inputSchema: RetrieveAutomailsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_automails,
  );

  server.registerTool(
    "cafe24_update_automails",
    {
      title: "Update Automails",
      description: "Update automated email settings.",
      inputSchema: UpdateAutomailsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_update_automails,
  );
}
