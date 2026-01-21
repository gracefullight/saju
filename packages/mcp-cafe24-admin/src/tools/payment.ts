import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type PaymentSettingParams,
  PaymentSettingParamsSchema,
  type PaymentSettingUpdateParams,
  PaymentSettingUpdateParamsSchema,
} from "@/schemas/payment.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

interface PaymentSettingResult {
  shop_no?: number;
  use_escrow?: string;
  use_escrow_account_transfer?: string;
  use_escrow_virtual_account?: string;
  pg_shipping_registration?: string;
  purchase_protection_amount?: string | number;
  use_direct_pay?: string;
  payment_display_type?: string;
  [key: string]: unknown;
}

async function cafe24_get_payment_setting(params: PaymentSettingParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/payment/setting", "GET", undefined, queryParams);
    const responseData = data as { setting?: Record<string, unknown> } | Record<string, unknown>;
    const setting = (responseData.setting || responseData) as PaymentSettingResult;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Payment Settings (Shop #${setting.shop_no || 1})\n\n` +
            `- **Escrow**: ${setting.use_escrow === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Escrow (Account Transfer)**: ${setting.use_escrow_account_transfer === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Escrow (Virtual Account)**: ${setting.use_escrow_virtual_account === "T" ? "Enabled" : "Disabled"}\n` +
            `- **PG Shipping Registration**: ${setting.pg_shipping_registration === "A" ? "Auto" : "Manual"}\n` +
            `- **Purchase Protection Amount**: ${setting.purchase_protection_amount || 0}\n` +
            `- **Direct/Quick Pay**: ${setting.use_direct_pay === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Display Type**: ${setting.payment_display_type === "L" ? "Logo" : "Text"}\n`,
        },
      ],
      structuredContent: {
        shop_no: setting.shop_no ?? 1,
        use_escrow: setting.use_escrow,
        use_escrow_account_transfer: setting.use_escrow_account_transfer,
        use_escrow_virtual_account: setting.use_escrow_virtual_account,
        pg_shipping_registration: setting.pg_shipping_registration,
        purchase_protection_amount: setting.purchase_protection_amount,
        use_direct_pay: setting.use_direct_pay,
        payment_display_type: setting.payment_display_type,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_payment_setting(params: PaymentSettingUpdateParams) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/payment/setting", "PUT", requestBody);
    const responseData = data as { setting?: Record<string, unknown> } | Record<string, unknown>;
    const setting = (responseData.setting || responseData) as PaymentSettingResult;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Payment Settings Updated (Shop #${setting.shop_no || 1})\n\n` +
            `- **Escrow**: ${setting.use_escrow === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Direct/Quick Pay**: ${setting.use_direct_pay === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: setting.shop_no ?? 1,
        use_escrow: setting.use_escrow,
        use_escrow_account_transfer: setting.use_escrow_account_transfer,
        use_escrow_virtual_account: setting.use_escrow_virtual_account,
        pg_shipping_registration: setting.pg_shipping_registration,
        use_direct_pay: setting.use_direct_pay,
        payment_display_type: setting.payment_display_type,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_payment_setting",
    {
      title: "Get Cafe24 Payment Settings",
      description:
        "Retrieve payment settings including Escrow status, PG shipping registration mode, direct/quick pay status, and payment method display type.",
      inputSchema: PaymentSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_payment_setting,
  );

  server.registerTool(
    "cafe24_update_payment_setting",
    {
      title: "Update Cafe24 Payment Settings",
      description:
        "Update payment settings. Configure Escrow usage (account transfer, virtual account), PG shipping registration (Auto/Manual), direct pay usage, and payment method display type (Text/Logo).",
      inputSchema: PaymentSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_payment_setting,
  );
}
