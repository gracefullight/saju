import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { CustomerPropertiesResponse } from "@/types/index.js";
import { CustomerPropertiesParamsSchema } from "@/schemas/customer-property.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

async function cafe24_list_customer_properties(
  params: z.infer<typeof CustomerPropertiesParamsSchema>,
) {
  try {
    const data = await makeApiRequest<CustomerPropertiesResponse>(
      "/admin/customers/properties",
      "GET",
      undefined,
      params,
    );
    const customer = data.customer;
    const properties = customer.properties || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Customer Properties (${customer.type.toUpperCase()}) - Shop #${customer.shop_no}\n\n` +
            properties
              .map(
                (p) =>
                  `## ${p.name} (${p.key})\n` +
                  `- **Use**: ${p.use === "T" ? "Yes" : "No"}\n` +
                  `- **Required**: ${p.required === "T" ? "Yes" : "No"}\n`,
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
    "cafe24_list_customer_properties",
    {
      title: "List Customer Properties",
      description: "Retrieve a list of account signup or edit fields (properties) from Cafe24.",
      inputSchema: CustomerPropertiesParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_customer_properties,
  );
}
