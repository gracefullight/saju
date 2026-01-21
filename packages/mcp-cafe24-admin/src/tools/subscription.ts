import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type SubscriptionShipmentCreate,
  SubscriptionShipmentCreateSchema,
  type SubscriptionShipmentDelete,
  SubscriptionShipmentDeleteSchema,
  type SubscriptionShipmentParams,
  SubscriptionShipmentParamsSchema,
  type SubscriptionShipmentsSearchParams,
  SubscriptionShipmentsSearchParamsSchema,
  type SubscriptionShipmentUpdate,
  SubscriptionShipmentUpdateSchema,
} from "@/schemas/subscription.js";
import type { SubscriptionShipment, SubscriptionShipmentSetting } from "@/types/index.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_subscription_shipment_settings(params: SubscriptionShipmentParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) queryParams.shop_no = params.shop_no;
    if (params.subscription_no) queryParams.subscription_no = params.subscription_no;

    const data = await makeApiRequest(
      "/admin/subscription/shipments/setting",
      "GET",
      undefined,
      queryParams,
    );
    const responseData = data as
      | { shipments?: Record<string, unknown>[] }
      | Record<string, unknown>;
    const shipments = (responseData.shipments || []) as SubscriptionShipmentSetting[];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${shipments.length} subscription shipment settings\n\n` +
            shipments
              .map(
                (s: SubscriptionShipmentSetting) =>
                  `## [${s.subscription_no}] ${s.subscription_shipments_name}\n` +
                  `- **Type**: ${s.product_binding_type}\n` +
                  `- **One-time Purchase**: ${s.one_time_purchase === "T" ? "Yes" : "No"}\n` +
                  `- **Discount**: ${s.use_discount === "T" ? "Yes" : "No"}\n` +
                  `- **Cycles**: ${s.subscription_shipments_cycle ? s.subscription_shipments_cycle.join(", ") : "N/A"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: shipments.length,
        shipments: shipments,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_subscription_shipment_setting(params: SubscriptionShipmentCreate) {
  try {
    const { shop_no, ...requestData } = params;
    const requestBody = {
      shop_no,
      request: requestData,
    };

    const data = await makeApiRequest("/admin/subscription/shipments/setting", "POST", requestBody);
    const responseData = data as { shipment?: Record<string, unknown> } | Record<string, unknown>;
    const shipment = (responseData.shipment || {}) as SubscriptionShipmentSetting;

    return {
      content: [
        {
          type: "text" as const,
          text: `Created subscription shipment setting: ${shipment.subscription_shipments_name} (No: ${shipment.subscription_no})`,
        },
      ],
      structuredContent: shipment as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_subscription_shipment_setting(params: SubscriptionShipmentUpdate) {
  try {
    const { shop_no, subscription_no, ...requestData } = params;
    const requestBody = {
      shop_no,
      request: requestData,
    };

    const data = await makeApiRequest(
      `/admin/subscription/shipments/setting/${subscription_no}`,
      "PUT",
      requestBody,
    );
    const responseData = data as { shipment?: Record<string, unknown> } | Record<string, unknown>;
    const shipment = (responseData.shipment || {}) as SubscriptionShipmentSetting;

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated subscription shipment setting #${shipment.subscription_no}: ${shipment.subscription_shipments_name}`,
        },
      ],
      structuredContent: shipment as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_subscription_shipment_setting(params: SubscriptionShipmentDelete) {
  try {
    await makeApiRequest(
      `/admin/subscription/shipments/setting/${params.subscription_no}`,
      "DELETE",
      undefined,
      { shop_no: params.shop_no },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted subscription shipment setting #${params.subscription_no}`,
        },
      ],
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_subscription_shipments(params: SubscriptionShipmentsSearchParams) {
  try {
    const data = await makeApiRequest("/admin/subscription/shipments", "GET", undefined, params);
    const responseData = data as
      | { shipments?: Record<string, unknown>[] }
      | Record<string, unknown>;
    const shipments = (responseData.shipments || []) as SubscriptionShipment[];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${shipments.length} subscription shipments\n\n` +
            shipments
              .map(
                (s) =>
                  `## ${s.subscription_id} (${s.buyer_name})\n` +
                  `- **Status**: ${s.subscription_state === "U" ? "Subscribed" : s.subscription_state === "P" ? "Paused" : "Unsubscribed"}\n` +
                  `- **Items**: ${s.items.map((i) => `${i.product_name} (${i.quantity})`).join(", ")}\n` +
                  `- **Created**: ${s.created_date}\n` +
                  `- **Receiver**: ${s.receiver_name} (${s.receiver_address1} ${s.receiver_address2 || ""})\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: shipments.length,
        shipments,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_subscription_shipment_settings",
    {
      title: "List Cafe24 Subscription Shipment Settings",
      description:
        "Retrieve a list of subscription shipment settings. Supports filtering by subscription_no.",
      inputSchema: SubscriptionShipmentParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_subscription_shipment_settings,
  );

  server.registerTool(
    "cafe24_create_subscription_shipment_setting",
    {
      title: "Create Cafe24 Subscription Shipment Setting",
      description:
        "Create a new subscription shipment setting. Requires name, binding type, cycle settings, and discount rules.",
      inputSchema: SubscriptionShipmentCreateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_subscription_shipment_setting,
  );

  server.registerTool(
    "cafe24_update_subscription_shipment_setting",
    {
      title: "Update Cafe24 Subscription Shipment Setting",
      description:
        "Update an existing subscription shipment setting. Can modify name, products, discounts, and cycles.",
      inputSchema: SubscriptionShipmentUpdateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_update_subscription_shipment_setting,
  );

  server.registerTool(
    "cafe24_delete_subscription_shipment_setting",
    {
      title: "Delete Cafe24 Subscription Shipment Setting",
      description: "Delete a subscription shipment setting by its ID.",
      inputSchema: SubscriptionShipmentDeleteSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_subscription_shipment_setting,
  );

  server.registerTool(
    "cafe24_list_subscription_shipments",
    {
      title: "List Cafe24 Subscription Shipments",
      description:
        "Retrieve a list of subscription shipments. Allows filtering by signup date, billing date, or cancellation date within a specified range.",
      inputSchema: SubscriptionShipmentsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_subscription_shipments,
  );
}
