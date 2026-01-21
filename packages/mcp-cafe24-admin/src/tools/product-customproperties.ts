import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  CustomPropertiesCreateParamsSchema,
  CustomPropertiesListParamsSchema,
  CustomPropertyDeleteParamsSchema,
  CustomPropertyUpdateParamsSchema,
} from "@/schemas/product-customproperties.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

interface CustomProperty {
  property_no: number;
  property_name: string;
}

interface CustomPropertiesListResponse {
  products: {
    custom_properties: CustomProperty[];
  };
}

interface CustomPropertiesResponse {
  product: {
    custom_properties: CustomProperty[];
  };
}

async function cafe24_list_custom_properties(
  _params: z.infer<typeof CustomPropertiesListParamsSchema>,
) {
  try {
    const data = await makeApiRequest<CustomPropertiesListResponse>(
      "/admin/products/customproperties",
      "GET",
    );

    const properties = data.products?.custom_properties || [];

    const content =
      properties.length > 0
        ? `**Custom Properties (${properties.length}):**\n\n` +
          properties.map((p) => `- **${p.property_no}**: ${p.property_name}`).join("\n")
        : "No custom properties found.";

    return {
      content: [{ type: "text" as const, text: content }],
      structuredContent: { custom_properties: properties } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_custom_properties(
  params: z.infer<typeof CustomPropertiesCreateParamsSchema>,
) {
  try {
    const { custom_properties } = params;

    const payload = {
      request: { custom_properties },
    };

    const data = await makeApiRequest<CustomPropertiesResponse>(
      "/admin/products/customproperties",
      "POST",
      payload,
    );

    const properties = data.product?.custom_properties || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Created ${properties.length} custom property(ies):\n\n` +
            properties.map((p) => `- **${p.property_no}**: ${p.property_name}`).join("\n"),
        },
      ],
      structuredContent: { custom_properties: properties } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_custom_property(
  params: z.infer<typeof CustomPropertyUpdateParamsSchema>,
) {
  try {
    const { property_no, property_name } = params;

    const payload = {
      request: { property_name },
    };

    const data = await makeApiRequest<CustomPropertiesResponse>(
      `/admin/products/customproperties/${property_no}`,
      "PUT",
      payload,
    );

    const properties = data.product?.custom_properties || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Updated custom property #${property_no} to "${property_name}"\n\n` +
            `**All Custom Properties:**\n` +
            properties.map((p) => `- **${p.property_no}**: ${p.property_name}`).join("\n"),
        },
      ],
      structuredContent: { custom_properties: properties } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_custom_property(
  params: z.infer<typeof CustomPropertyDeleteParamsSchema>,
) {
  try {
    const { property_no } = params;

    const data = await makeApiRequest<CustomPropertiesResponse>(
      `/admin/products/customproperties/${property_no}`,
      "DELETE",
    );

    const properties = data.product?.custom_properties || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Deleted custom property #${property_no}\n\n` +
            `**Remaining Custom Properties:**\n` +
            (properties.length > 0
              ? properties.map((p) => `- **${p.property_no}**: ${p.property_name}`).join("\n")
              : "None"),
        },
      ],
      structuredContent: { custom_properties: properties } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_custom_properties",
    {
      title: "List Custom Properties",
      description: "Retrieve all user-defined custom properties for products.",
      inputSchema: CustomPropertiesListParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_custom_properties,
  );

  server.registerTool(
    "cafe24_create_custom_properties",
    {
      title: "Create Custom Properties",
      description: "Create new user-defined custom properties for products.",
      inputSchema: CustomPropertiesCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_custom_properties,
  );

  server.registerTool(
    "cafe24_update_custom_property",
    {
      title: "Update Custom Property",
      description: "Update the name of an existing custom property.",
      inputSchema: CustomPropertyUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_custom_property,
  );

  server.registerTool(
    "cafe24_delete_custom_property",
    {
      title: "Delete Custom Property",
      description: "Delete a custom property by its property number.",
      inputSchema: CustomPropertyDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_custom_property,
  );
}
