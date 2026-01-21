import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type AutomessageArgumentsParams,
  AutomessageArgumentsParamsSchema,
  type AutomessageSettingParams,
  AutomessageSettingParamsSchema,
  type AutomessageSettingUpdateParams,
  AutomessageSettingUpdateParamsSchema,
} from "@/schemas/automessage.js";
import type { AutomessageArgument, AutomessageSetting } from "@/types/index.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

async function cafe24_get_automessage_arguments(params: AutomessageArgumentsParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest<{ arguments: AutomessageArgument[] }>(
      "/admin/automessages/arguments",
      "GET",
      undefined,
      queryParams,
    );

    const args = data.arguments || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Automessage Arguments\n\n` +
            `Found ${args.length} available placeholders:\n\n` +
            args
              .map(
                (a) =>
                  `### ${a.name}\n` +
                  `- **Description**: ${a.description}\n` +
                  `- **Sample**: ${a.sample}\n` +
                  `- **Max Length**: ${a.string_length} chars\n` +
                  `- **Send Case**: ${a.send_case}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: args.length,
        arguments: args.map((a: AutomessageArgument) => ({
          shop_no: a.shop_no,
          name: a.name,
          description: a.description,
          sample: a.sample,
          string_length: a.string_length,
          send_case: a.send_case,
        })),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_automessage_setting(params: AutomessageSettingParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest<{ automessages: AutomessageSetting } | AutomessageSetting>(
      "/admin/automessages/setting",
      "GET",
      undefined,
      queryParams,
    );
    const responseData = data as { automessages?: AutomessageSetting } | AutomessageSetting;
    const settings = (
      "automessages" in responseData ? responseData.automessages : responseData
    ) as AutomessageSetting;

    const useSmsText = settings.use_sms === "T" ? "Enabled" : "Disabled";
    const useKakaoText = settings.use_kakaoalimtalk === "T" ? "Enabled" : "Disabled";
    const usePushText = settings.use_push === "T" ? "Enabled" : "Disabled";
    const sendMethodText = settings.send_method === "S" ? "SMS" : "KakaoAlimtalk (SMS fallback)";
    const sendMethodPushText =
      settings.send_method_push === "T" ? "Push First" : "No Push Priority";

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Automessage Settings (Shop #${settings.shop_no || 1})\n\n` +
            `- **SMS**: ${useSmsText}\n` +
            `- **KakaoAlimtalk**: ${useKakaoText}\n` +
            `- **Push**: ${usePushText}\n` +
            `- **Send Method**: ${sendMethodText}\n` +
            `- **Push Priority**: ${sendMethodPushText}\n`,
        },
      ],
      structuredContent: {
        shop_no: settings.shop_no ?? 1,
        use_sms: settings.use_sms,
        use_kakaoalimtalk: settings.use_kakaoalimtalk,
        use_push: settings.use_push,
        send_method: settings.send_method,
        send_method_push: settings.send_method_push,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_automessage_setting(params: AutomessageSettingUpdateParams) {
  try {
    const requestBody = {
      shop_no: params.shop_no ?? 1,
      request: {
        send_method: params.send_method,
        send_method_push: params.send_method_push,
      } as Record<string, unknown>,
    };

    const data = await makeApiRequest<{ automessages: AutomessageSetting } | AutomessageSetting>(
      "/admin/automessages/setting",
      "PUT",
      requestBody,
    );
    const responseData = data as { automessages?: AutomessageSetting } | AutomessageSetting;
    const settings = (
      "automessages" in responseData ? responseData.automessages : responseData
    ) as AutomessageSetting;

    const sendMethodText = settings.send_method === "S" ? "SMS" : "KakaoAlimtalk (SMS fallback)";
    const sendMethodPushText =
      settings.send_method_push === "T" ? "Push First" : "No Push Priority";

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Automessage Settings Updated (Shop #${settings.shop_no || 1})\n\n` +
            `- **Send Method**: ${sendMethodText}\n` +
            `- **Push Priority**: ${sendMethodPushText}\n`,
        },
      ],
      structuredContent: {
        shop_no: settings.shop_no ?? 1,
        send_method: settings.send_method,
        send_method_push: settings.send_method_push,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_automessage_arguments",
    {
      title: "Get Cafe24 Automessage Arguments",
      description:
        "Retrieve available placeholders/arguments for automessages like [NAME], [PRODUCT], etc. Returns name, description, sample value, max length, and applicable send cases for each placeholder.",
      inputSchema: AutomessageArgumentsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_automessage_arguments,
  );

  server.registerTool(
    "cafe24_get_automessage_setting",
    {
      title: "Get Cafe24 Automessage Settings",
      description:
        "Retrieve current automessage configuration including SMS, KakaoAlimtalk, and Push notification settings. Shows whether each channel is enabled and current send method.",
      inputSchema: AutomessageSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_automessage_setting,
  );

  server.registerTool(
    "cafe24_update_automessage_setting",
    {
      title: "Update Cafe24 Automessage Settings",
      description:
        "Update automessage send method (SMS or KakaoAlimtalk with SMS fallback) and push notification priority settings.",
      inputSchema: AutomessageSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_automessage_setting,
  );
}
