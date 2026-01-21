import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { BuyerHistoryResponse, BuyerResponse, BuyerUpdateResponse } from "@/types/index.js";
import { BuyerParamsSchema, BuyerUpdateParamsSchema } from "../schemas/order-buyer.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_get_order_buyer(params: z.infer<typeof BuyerParamsSchema>) {
  try {
    const { order_id, shop_no } = params;
    const data = await makeApiRequest<BuyerResponse>(
      `/admin/orders/${order_id}/buyer`,
      "GET",
      undefined,
      { shop_no },
    );
    const buyer = data.buyer;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Buyer Information for Order #${order_id}\n\n` +
            `- **Name**: ${buyer.name} (${buyer.member_id})\n` +
            `- **Email**: ${buyer.email}\n` +
            `- **Phone**: ${buyer.phone}\n` +
            `- **Cellphone**: ${buyer.cellphone}\n` +
            `- **Address**: ${buyer.buyer_zipcode}, ${buyer.buyer_address1} ${buyer.buyer_address2}\n` +
            `- **Company**: ${buyer.company_name} (${buyer.company_registration_no || "N/A"})\n` +
            `- **Notification**: ${buyer.customer_notification || "N/A"}\n`,
        },
      ],
      structuredContent: {
        buyer: data.buyer,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order_buyer(params: z.infer<typeof BuyerUpdateParamsSchema>) {
  try {
    const { order_id, shop_no, request } = params;
    const data = await makeApiRequest<BuyerUpdateResponse>(
      `/admin/orders/${order_id}/buyer`,
      "PUT",
      {
        shop_no,
        request,
      },
    );
    const buyer = data.buyer;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Buyer Information Updated for Order #${order_id}\n\n` +
            `- **Name**: ${buyer.name}\n` +
            `- **Email**: ${buyer.email}\n` +
            `- **Phone**: ${buyer.phone}\n` +
            `- **Cellphone**: ${buyer.cellphone}\n` +
            `- **Notification**: ${buyer.customer_notification || "N/A"}\n`,
        },
      ],
      structuredContent: {
        buyer: data.buyer,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_order_buyer_history(params: z.infer<typeof BuyerParamsSchema>) {
  try {
    const { order_id, shop_no } = params;
    const data = await makeApiRequest<BuyerHistoryResponse>(
      `/admin/orders/${order_id}/buyer/history`,
      "GET",
      undefined,
      { shop_no },
    );
    const history = data.history || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Buyer History for Order #${order_id}\n\n` +
            history
              .map(
                (entry) =>
                  `## Updated on ${entry.updated_date} by ${entry.user_name} (${entry.user_id})\n` +
                  `- **Name**: ${entry.name}\n` +
                  `- **Email**: ${entry.email}\n` +
                  `- **Phone**: ${entry.phone}\n` +
                  `- **Cellphone**: ${entry.cellphone}\n` +
                  `- **Notification**: ${entry.customer_notification || "N/A"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        history: data.history,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerBuyerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_order_buyer",
    {
      title: "Get Cafe24 Order Buyer Info",
      description: "Retrieve the orderer/buyer information for a specific order.",
      inputSchema: BuyerParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_order_buyer,
  );

  server.registerTool(
    "cafe24_update_order_buyer",
    {
      title: "Update Cafe24 Order Buyer Info",
      description: "Update the orderer/buyer information for a specific order.",
      inputSchema: BuyerUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_order_buyer,
  );

  server.registerTool(
    "cafe24_get_order_buyer_history",
    {
      title: "Get Cafe24 Order Buyer History",
      description: "Retrieve the change history of orderer/buyer information for a specific order.",
      inputSchema: BuyerParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_order_buyer_history,
  );
}
