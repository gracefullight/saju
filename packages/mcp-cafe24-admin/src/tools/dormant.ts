import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type DormantAccountParams,
  DormantAccountParamsSchema,
  type DormantAccountUpdateParams,
  DormantAccountUpdateParamsSchema,
} from "@/schemas/dormant.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_get_dormant_account(params: DormantAccountParams) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/dormantaccount", "GET", undefined, queryParams);
    const dormant = data.dormantaccount || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Dormant Account Settings (Shop #${dormant.shop_no || 1})\n\n` +
            `- **Feature Enabled**: ${dormant.use === "T" ? "Yes" : "No"}\n` +
            `- **Auto Send Notice**: ${dormant.notice_send_automatic === "T" ? "Yes" : "No"}\n` +
            `- **Send SMS/KakaoTalk**: ${dormant.send_sms === "T" ? "Yes" : "No"}\n` +
            `- **Send Email**: ${dormant.send_email === "T" ? "Yes" : "No"}\n` +
            `- **Point Extinction**: ${dormant.point_extinction === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: {
        shop_no: dormant.shop_no ?? 1,
        use: dormant.use,
        notice_send_automatic: dormant.notice_send_automatic,
        send_sms: dormant.send_sms,
        send_email: dormant.send_email,
        point_extinction: dormant.point_extinction,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_dormant_account(params: DormantAccountUpdateParams) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, any> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/dormantaccount", "PUT", requestBody);
    const dormant = data.dormantaccount || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Dormant Account Settings Updated (Shop #${dormant.shop_no || 1})\n\n` +
            `- **Feature Enabled**: ${dormant.use === "T" ? "Yes" : "No"}\n` +
            `- **Auto Send Notice**: ${dormant.notice_send_automatic === "T" ? "Yes" : "No"}\n` +
            `- **Point Extinction**: ${dormant.point_extinction === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: {
        shop_no: dormant.shop_no ?? 1,
        use: dormant.use,
        notice_send_automatic: dormant.notice_send_automatic,
        send_sms: dormant.send_sms,
        send_email: dormant.send_email,
        point_extinction: dormant.point_extinction,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_dormant_account",
    {
      title: "Get Cafe24 Dormant Account Settings",
      description:
        "Retrieve dormant account settings including feature status, auto notice sending, SMS/KakaoTalk/email notification options, and point extinction policy.",
      inputSchema: DormantAccountParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_dormant_account,
  );

  server.registerTool(
    "cafe24_update_dormant_account",
    {
      title: "Update Cafe24 Dormant Account Settings",
      description:
        "Update dormant account settings including enabling/disabling the feature, auto notice sending, notification channels (SMS/KakaoTalk or email), and point extinction policy.",
      inputSchema: DormantAccountUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_dormant_account,
  );
}
