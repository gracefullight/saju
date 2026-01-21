import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type BenefitSettingParams,
  BenefitSettingParamsSchema,
  type BenefitSettingUpdateParams,
  BenefitSettingUpdateParamsSchema,
} from "@/schemas/benefit.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_get_benefit_setting(params: BenefitSettingParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/benefits/setting", "GET", undefined, queryParams);
    const responseData = data as
      | { benefit?: Record<string, unknown> }
      | (Record<string, unknown> & { use_gift?: string });
    const benefit = (responseData.benefit || responseData) as Record<string, unknown>;

    const useGiftText = benefit.use_gift === "T" ? "Enabled" : "Disabled";
    const paymentMethodText =
      benefit.available_payment_methods === "all"
        ? "All payments"
        : benefit.available_payment_methods === "bank_only"
          ? "Bank transfer only"
          : "Exclude bank transfer";
    const grantTypeText = benefit.gift_grant_type === "S" ? "Customer selection" : "Automatic";
    const selectionModeText = benefit.gift_selection_mode === "S" ? "Single" : "Multiple";

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Benefit/Gift Settings\n\n` +
            `- **Gift Feature**: ${useGiftText}\n` +
            `- **Payment Methods**: ${paymentMethodText}\n` +
            `- **Allow Point Payment**: ${benefit.allow_point_payment === "T" ? "Yes" : "No"}\n` +
            `- **Calculation Scope**: ${benefit.gift_calculation_scope}\n` +
            `- **Calculation Type**: ${benefit.gift_calculation_type}\n` +
            `- **Include Shipping Fee**: ${benefit.include_shipping_fee === "I" ? "Yes" : "No"}\n` +
            `- **Grant Type**: ${grantTypeText}\n` +
            `- **Selection Mode**: ${selectionModeText}\n` +
            `- **Selection Steps**: ${((benefit.gift_selection_step as string[]) || []).join(", ")}\n` +
            `- **Allow Gift Review**: ${benefit.allow_gift_review === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: {
        use_gift: benefit.use_gift,
        available_payment_methods: benefit.available_payment_methods,
        allow_point_payment: benefit.allow_point_payment,
        gift_calculation_scope: benefit.gift_calculation_scope,
        gift_calculation_type: benefit.gift_calculation_type,
        include_point_usage: benefit.include_point_usage,
        include_shipping_fee: benefit.include_shipping_fee,
        display_soldout_gifts: benefit.display_soldout_gifts,
        gift_grant_type: benefit.gift_grant_type,
        gift_selection_mode: benefit.gift_selection_mode,
        gift_grant_mode: benefit.gift_grant_mode,
        gift_selection_step: benefit.gift_selection_step,
        gift_available_condition: benefit.gift_available_condition,
        offer_only_one_in_automatic: benefit.offer_only_one_in_automatic,
        allow_gift_review: benefit.allow_gift_review,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_benefit_setting(params: BenefitSettingUpdateParams) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/benefits/setting", "PUT", requestBody);
    const responseData = data as
      | { benefit?: Record<string, unknown> }
      | (Record<string, unknown> & { use_gift?: string });
    const benefit = (responseData.benefit || responseData) as Record<string, unknown>;

    const useGiftText = benefit.use_gift === "T" ? "Enabled" : "Disabled";
    const grantTypeText = benefit.gift_grant_type === "S" ? "Customer selection" : "Automatic";

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Benefit/Gift Settings Updated\n\n` +
            `- **Gift Feature**: ${useGiftText}\n` +
            `- **Grant Type**: ${grantTypeText}\n` +
            `- **Selection Steps**: ${((benefit.gift_selection_step as string[]) || []).join(", ")}\n`,
        },
      ],
      structuredContent: {
        use_gift: benefit.use_gift,
        available_payment_methods: benefit.available_payment_methods,
        allow_point_payment: benefit.allow_point_payment,
        gift_calculation_scope: benefit.gift_calculation_scope,
        gift_calculation_type: benefit.gift_calculation_type,
        include_shipping_fee: benefit.include_shipping_fee,
        display_soldout_gifts: benefit.display_soldout_gifts,
        gift_grant_type: benefit.gift_grant_type,
        gift_selection_mode: benefit.gift_selection_mode,
        gift_selection_step: benefit.gift_selection_step,
        gift_available_condition: benefit.gift_available_condition,
        allow_gift_review: benefit.allow_gift_review,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_benefit_setting",
    {
      title: "Get Cafe24 Benefit/Gift Settings",
      description:
        "Retrieve benefit/gift settings including gift feature enablement, payment methods, calculation scope, grant type, selection mode, and review settings.",
      inputSchema: BenefitSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_benefit_setting,
  );

  server.registerTool(
    "cafe24_update_benefit_setting",
    {
      title: "Update Cafe24 Benefit/Gift Settings",
      description:
        "Update benefit/gift settings including gift feature enablement, payment methods, calculation scope/type, grant type, selection mode/steps, and review settings.",
      inputSchema: BenefitSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_benefit_setting,
  );
}
