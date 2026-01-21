import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type SocialNaverShoppingParams,
  SocialNaverShoppingParamsSchema,
} from "@/schemas/socialnavershopping.js";
import type { SocialNaverShoppingSetting } from "@/types/index.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

async function cafe24_get_social_naver_shopping_setting(params: SocialNaverShoppingParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest(
      "/admin/socials/navershopping",
      "GET",
      undefined,
      queryParams,
    );
    const responseData = data as
      | { navershopping?: Record<string, unknown> }
      | Record<string, unknown>;
    const navershopping = (responseData.navershopping ||
      responseData) as SocialNaverShoppingSetting;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Social: Naver Shopping (Shop #${navershopping.shop_no || 1})\n\n` +
            `- **Mall ID**: ${navershopping.mall_id || "N/A"}\n` +
            `- **Service Status**: ${navershopping.service_status === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: navershopping.shop_no,
        mall_id: navershopping.mall_id,
        service_status: navershopping.service_status,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_social_naver_shopping_setting",
    {
      title: "Get Cafe24 Naver Shopping Settings",
      description:
        "Retrieve Naver Shopping integration settings including Mall ID and service status.",
      inputSchema: SocialNaverShoppingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_social_naver_shopping_setting,
  );
}
