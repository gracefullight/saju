import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type SmsParams, SmsParamsSchema } from "@/schemas/sms.js";
import type { SmsSetting } from "@/types/index.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

async function cafe24_get_sms_setting(params: SmsParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/sms/setting", "GET", undefined, queryParams);
    const responseData = data as { sms?: Record<string, unknown> } | Record<string, unknown>;
    const sms = (responseData.sms || responseData) as SmsSetting;

    return {
      content: [
        {
          type: "text" as const,
          text: `## SMS Settings\n\n- **Use SMS**: ${sms.use_sms || "N/A"}\n`,
        },
      ],
      structuredContent: sms as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_sms_setting",
    {
      title: "Get Cafe24 SMS Settings",
      description: "Retrieve SMS usage and configuration settings.",
      inputSchema: SmsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_sms_setting,
  );
}
