import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import { CustomerPlusAppParamsSchema } from "@/schemas/customer-plus-app.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { CustomerPlusAppResponse } from "@/types/index.js";

async function cafe24_get_customer_plusapp_info(
  params: z.infer<typeof CustomerPlusAppParamsSchema>,
) {
  try {
    const { member_id, ...queryParams } = params;
    const data = await makeApiRequest<CustomerPlusAppResponse>(
      `/admin/customers/${member_id}/plusapp`,
      "GET",
      undefined,
      queryParams,
    );
    const apps = data.plusapp || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Plus App Information for ${member_id}\n\n` +
            apps
              .map(
                (app) =>
                  `## OS: ${app.os_type.toUpperCase()}\n` +
                  `- **Install Date**: ${app.install_date}\n` +
                  `- **Auto Login**: ${app.auto_login_flag === "T" ? "Enabled" : "Disabled"}\n` +
                  `- **Push Notifications**: ${app.use_push_flag === "T" ? "Enabled" : "Disabled"}\n`,
              )
              .join("\n"),
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
    "cafe24_get_customer_plusapp_info",
    {
      title: "Get Customer Plus App Information",
      description:
        "Retrieve Cafe24 Plus App installation and setting information for a specific customer.",
      inputSchema: CustomerPlusAppParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_customer_plusapp_info,
  );
}
