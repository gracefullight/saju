import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  OrderFormSettingsParamsSchema,
  UpdateOrderFormSettingsParamsSchema,
} from "../schemas/orderform.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

interface OrderFormSettings {
  shop_no?: number;
  buy_limit_type?: string;
  guest_purchase_button_display?: string;
  order_form_input_type?: string;
  quick_signup?: string;
  [key: string]: unknown;
}

async function cafe24_get_orderform_setting(params: z.infer<typeof OrderFormSettingsParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/orderform/setting", "GET", undefined, {
      shop_no: params.shop_no,
    });
    const responseData = data as { orderform?: Record<string, unknown> } | Record<string, unknown>;
    const settings = (responseData.orderform || {}) as OrderFormSettings;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Order Form Settings (Shop #${settings.shop_no})\n\n` +
            `- **Buy Limit**: ${settings.buy_limit_type === "M" ? "Members Only" : "Everyone"}\n` +
            `- **Guest Purchase Button**: ${settings.guest_purchase_button_display === "T" ? "Show" : "Hide"}\n` +
            `- **Input Type**: ${settings.order_form_input_type === "A" ? "Shipping Info Only" : "Separate Order/Shipping Info"}\n` +
            `- **Quick Signup**: ${settings.quick_signup === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: settings as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_orderform_setting(
  params: z.infer<typeof UpdateOrderFormSettingsParamsSchema>,
) {
  try {
    const { shop_no, ...requestParams } = params;
    const data = await makeApiRequest("/admin/orderform/setting", "PUT", {
      shop_no,
      request: requestParams,
    });
    const responseData = data as { orderform?: Record<string, unknown> } | Record<string, unknown>;
    const settings = (responseData.orderform || {}) as OrderFormSettings;

    return {
      content: [
        {
          type: "text" as const,
          text: `Order form settings updated for Shop #${settings.shop_no}`,
        },
      ],
      structuredContent: settings as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_orderform_setting",
    {
      title: "Get Order Form Settings",
      description:
        "Retrieve configuration for the order form, including purchase limits, input fields, and display options.",
      inputSchema: OrderFormSettingsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_orderform_setting,
  );

  server.registerTool(
    "cafe24_update_orderform_setting",
    {
      title: "Update Order Form Settings",
      description: "Update configuration for the order form. Only provided fields will be updated.",
      inputSchema: UpdateOrderFormSettingsParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_update_orderform_setting,
  );
}
