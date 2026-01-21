import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type MobileSettingParams,
  MobileSettingParamsSchema,
  type MobileSettingUpdateParams,
  MobileSettingUpdateParamsSchema,
} from "@/schemas/mobile.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { MobileSetting } from "@/types/index.js";

async function cafe24_get_mobile_setting(params: MobileSettingParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/mobile/setting", "GET", undefined, queryParams);
    const responseData = data as { mobile?: Record<string, unknown> } | Record<string, unknown>;
    const mobile = (responseData.mobile || responseData) as MobileSetting;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Mobile Settings (Shop #${mobile.shop_no || 1})\n\n` +
            `- **Mobile Page Enabled**: ${mobile.use_mobile_page === "T" ? "Yes" : "No"}\n` +
            `- **Mobile Domain Redirection**: ${mobile.use_mobile_domain_redirection === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: {
        shop_no: mobile.shop_no ?? 1,
        use_mobile_page: mobile.use_mobile_page,
        use_mobile_domain_redirection: mobile.use_mobile_domain_redirection,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_mobile_setting(params: MobileSettingUpdateParams) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/mobile/setting", "PUT", requestBody);
    const responseData = data as { mobile?: Record<string, unknown> } | Record<string, unknown>;
    const mobile = (responseData.mobile || responseData) as MobileSetting;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Mobile Settings Updated (Shop #${mobile.shop_no || 1})\n\n` +
            `- **Mobile Page Enabled**: ${mobile.use_mobile_page === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: {
        shop_no: mobile.shop_no ?? 1,
        use_mobile_page: mobile.use_mobile_page,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_mobile_setting",
    {
      title: "Get Cafe24 Mobile Settings",
      description:
        "Retrieve mobile page usage settings and mobile domain redirection status for the shop.",
      inputSchema: MobileSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_mobile_setting,
  );

  server.registerTool(
    "cafe24_update_mobile_setting",
    {
      title: "Update Cafe24 Mobile Settings",
      description:
        "Enable or disable the mobile shopping mall page. Set use_mobile_page to T (enable) or F (disable).",
      inputSchema: MobileSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_mobile_setting,
  );
}
