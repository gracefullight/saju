import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type BenefitCreate,
  BenefitCreateSchema,
  type BenefitDelete,
  BenefitDeleteSchema,
  type BenefitSettingParams,
  BenefitSettingParamsSchema,
  type BenefitSettingUpdateParams,
  BenefitSettingUpdateParamsSchema,
  type BenefitsSearchParams,
  BenefitsSearchParamsSchema,
  type BenefitUpdate,
  BenefitUpdateSchema,
} from "@/schemas/benefit.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type {
  BenefitCreateRequest,
  BenefitResponse,
  BenefitsCountResponse,
  BenefitsResponse,
  BenefitUpdateRequest,
} from "../types/benefit.js";

async function cafe24_list_benefits(params: BenefitsSearchParams) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestParams: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      ...queryParams,
    };

    const data = await makeApiRequest("/admin/benefits", "GET", undefined, requestParams);
    const response = data as BenefitsResponse;

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${response.benefits.length} benefits`,
        },
      ],
      structuredContent: response.benefits as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_benefits(params: BenefitsSearchParams) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestParams: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      ...queryParams,
    };

    const data = await makeApiRequest("/admin/benefits/count", "GET", undefined, requestParams);
    const response = data as BenefitsCountResponse;

    return {
      content: [
        {
          type: "text" as const,
          text: `Total benefits count: ${response.count}`,
        },
      ],
      structuredContent: { count: response.count },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_benefit(params: { shop_no?: number; benefit_no: number }) {
  try {
    const { shop_no, benefit_no } = params;
    const queryParams: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
    };

    const data = await makeApiRequest(
      `/admin/benefits/${benefit_no}`,
      "GET",
      undefined,
      queryParams,
    );
    const response = data as BenefitResponse;

    return {
      content: [
        {
          type: "text" as const,
          text: `## Benefit: ${response.benefit.benefit_name}
- ID: ${response.benefit.benefit_no}
- Type: ${response.benefit.benefit_type}
- Status: ${response.benefit.use_benefit === "T" ? "Active" : "Inactive"}
- Period: ${
            response.benefit.use_benefit_period === "T"
              ? `${response.benefit.benefit_start_date} ~ ${response.benefit.benefit_end_date}`
              : "No Limit"
          }
`,
        },
      ],
      structuredContent: response.benefit as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_benefit(params: BenefitCreate) {
  try {
    const { shop_no, ...createData } = params;
    const requestBody: BenefitCreateRequest = {
      shop_no: shop_no ?? 1,
      request: createData,
    };

    const data = await makeApiRequest("/admin/benefits", "POST", requestBody);
    const response = data as BenefitResponse;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created benefit: ${response.benefit.benefit_name} (ID: ${response.benefit.benefit_no})`,
        },
      ],
      structuredContent: response.benefit as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_benefit(params: BenefitUpdate) {
  try {
    const { shop_no, benefit_no, ...updateData } = params;

    // Type assertion to bypass strict typing of BenefitUpdateRequest for partial updates if needed,
    // though the provided interface is stricter.
    // The schema allows optional fields, so we need to construct the request carefully.

    const requestBody: BenefitUpdateRequest = {
      shop_no: shop_no ?? 1,
      request: updateData as BenefitUpdateRequest["request"],
    };

    const data = await makeApiRequest(`/admin/benefits/${benefit_no}`, "PUT", requestBody);
    // PUT usually returns 204 or minimal response, but Cafe24 often returns the updated object or just success
    // Documentation says it returns parameters shop_no, benefit_no in "benefit" object
    const response = data as BenefitResponse;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated benefit ${benefit_no}`,
        },
      ],
      structuredContent: (response.benefit || response) as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_benefit(params: BenefitDelete) {
  try {
    const { shop_no, benefit_no } = params;

    // DELETE with body? Cafe24 docs sometimes use query params for DELETE,
    // but the example shows body-like behavior or just path.
    // However, usually DELETE requests don't have a body. The example CURL shows headers and url.
    // Wait, the CURL example has no body, but shows shop_no in description/response.
    // Let's use query params for safety for shop_no.
    const queryParams = { shop_no: shop_no ?? 1 };

    const data = await makeApiRequest(
      `/admin/benefits/${benefit_no}`,
      "DELETE",
      undefined,
      queryParams,
    );
    const response = data as BenefitResponse;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted benefit ${response.benefit.benefit_no}`,
        },
      ],
      structuredContent: response.benefit as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

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

  server.registerTool(
    "cafe24_list_benefits",
    {
      title: "List Benefits",
      description: "Search and list benefits",
      inputSchema: BenefitsSearchParamsSchema,
    },
    cafe24_list_benefits,
  );

  server.registerTool(
    "cafe24_count_benefits",
    {
      title: "Count Benefits",
      description: "Get total count of benefits matching search criteria",
      inputSchema: BenefitsSearchParamsSchema,
    },
    cafe24_count_benefits,
  );

  server.registerTool(
    "cafe24_get_benefit",
    {
      title: "Get Benefit",
      description: "Retrieve details of a specific benefit",
      inputSchema: BenefitDeleteSchema, // Reusing delete schema as it has same shop_no+benefit_no structure
    },
    cafe24_get_benefit,
  );

  server.registerTool(
    "cafe24_create_benefit",
    {
      title: "Create Benefit",
      description: "Create a new benefit",
      inputSchema: BenefitCreateSchema,
    },
    cafe24_create_benefit,
  );

  server.registerTool(
    "cafe24_update_benefit",
    {
      title: "Update Benefit",
      description: "Update an existing benefit",
      inputSchema: BenefitUpdateSchema,
    },
    cafe24_update_benefit,
  );

  server.registerTool(
    "cafe24_delete_benefit",
    {
      title: "Delete Benefit",
      description: "Delete a benefit",
      inputSchema: BenefitDeleteSchema,
    },
    cafe24_delete_benefit,
  );
}
