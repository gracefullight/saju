import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  CreateCarrierParamsSchema,
  DeleteCarrierParamsSchema,
  GetCarrierParamsSchema,
  ListCarriersParamsSchema,
  UpdateCarrierParamsSchema,
} from "../schemas/carrier.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { CarrierResponse, ListCarriersResponse } from "../types/carrier.js";

async function cafe24_list_carriers(params: z.infer<typeof ListCarriersParamsSchema>) {
  try {
    const { shop_no } = params;
    const data = await makeApiRequest<ListCarriersResponse>("/admin/carriers", "GET", undefined, {
      shop_no,
    });
    const carriers = data.carriers || [];
    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${carriers.length} carriers\n\n` +
            carriers
              .map(
                (c) =>
                  `## ${c.shipping_carrier} (ID: ${c.carrier_id})\n` +
                  `- Code: ${c.shipping_carrier_code}\n` +
                  `- Type: ${c.shipping_type}\n` +
                  `- Contact: ${c.contact}\n` +
                  `- Email: ${c.email}`,
              )
              .join("\n\n"),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_get_carrier(params: z.infer<typeof GetCarrierParamsSchema>) {
  try {
    const { carrier_id, shop_no } = params;
    const data = await makeApiRequest<CarrierResponse>(
      `/admin/carriers/${carrier_id}`,
      "GET",
      undefined,
      { shop_no },
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Carrier Details (ID: ${carrier_id}):\n${JSON.stringify(data.carrier, null, 2)}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_create_carrier(params: z.infer<typeof CreateCarrierParamsSchema>) {
  try {
    const { shop_no, ...rest } = params;
    const requestBody = {
      shop_no,
      request: rest,
    };
    const data = await makeApiRequest<CarrierResponse>("/admin/carriers", "POST", requestBody);
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created carrier ${data.carrier.shipping_carrier} with ID ${data.carrier.carrier_id}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_update_carrier(params: z.infer<typeof UpdateCarrierParamsSchema>) {
  try {
    const { carrier_id, shop_no, ...rest } = params;
    const requestBody = {
      shop_no,
      request: rest,
    };
    const data = await makeApiRequest<CarrierResponse>(
      `/admin/carriers/${carrier_id}`,
      "PUT",
      requestBody,
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated carrier ID ${carrier_id}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_delete_carrier(params: z.infer<typeof DeleteCarrierParamsSchema>) {
  try {
    const { carrier_id, shop_no, delete_default_carrier } = params;
    const data = await makeApiRequest<CarrierResponse>(
      `/admin/carriers/${carrier_id}`,
      "DELETE",
      undefined,
      {
        shop_no,
        delete_default_carrier,
      },
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted carrier ID ${carrier_id}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_carriers",
    {
      title: "List Carriers",
      description: "Retrieve a list of shipping carriers available for the shop.",
      inputSchema: ListCarriersParamsSchema,
    },
    cafe24_list_carriers,
  );

  server.registerTool(
    "cafe24_get_carrier",
    {
      title: "Get Carrier",
      description: "Retrieve details of a specific shipping carrier.",
      inputSchema: GetCarrierParamsSchema,
    },
    cafe24_get_carrier,
  );

  server.registerTool(
    "cafe24_create_carrier",
    {
      title: "Create Carrier",
      description: "Add a new shipping carrier to the shop.",
      inputSchema: CreateCarrierParamsSchema,
    },
    cafe24_create_carrier,
  );

  server.registerTool(
    "cafe24_update_carrier",
    {
      title: "Update Carrier",
      description: "Update settings for an existing shipping carrier.",
      inputSchema: UpdateCarrierParamsSchema,
    },
    cafe24_update_carrier,
  );

  server.registerTool(
    "cafe24_delete_carrier",
    {
      title: "Delete Carrier",
      description: "Remove a shipping carrier from the shop.",
      inputSchema: DeleteCarrierParamsSchema,
    },
    cafe24_delete_carrier,
  );
}
