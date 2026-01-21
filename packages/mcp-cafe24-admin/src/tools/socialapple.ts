import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type SocialAppleParams,
  SocialAppleParamsSchema,
  type SocialAppleUpdateParams,
  SocialAppleUpdateParamsSchema,
} from "@/schemas/socialapple.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { SocialAppleSetting } from "@/types/index.js";

async function cafe24_get_social_apple_setting(params: SocialAppleParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/socials/apple", "GET", undefined, queryParams);
    const responseData = data as { apple?: Record<string, unknown> } | Record<string, unknown>;
    const apple = (responseData.apple || responseData) as SocialAppleSetting;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Social Login: Apple (Shop #${apple.shop_no || 1})\n\n` +
            `- **Status**: ${apple.use_apple_login === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Client ID**: ${apple.client_id || "N/A"}\n` +
            `- **Team ID**: ${apple.team_id || "N/A"}\n` +
            `- **Key ID**: ${apple.key_id || "N/A"}\n` +
            `- **Auth Key File**: ${apple.auth_key_file_name || "N/A"}\n` +
            `- **Certification**: ${apple.use_certification === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: apple.shop_no,
        use_apple_login: apple.use_apple_login,
        client_id: apple.client_id,
        team_id: apple.team_id,
        key_id: apple.key_id,
        auth_key_file_name: apple.auth_key_file_name,
        use_certification: apple.use_certification,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_social_apple_setting(params: SocialAppleUpdateParams) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/socials/apple", "PUT", requestBody);
    const responseData = data as { apple?: Record<string, unknown> } | Record<string, unknown>;
    const apple = (responseData.apple || responseData) as SocialAppleSetting;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Social Login: Apple Updated (Shop #${apple.shop_no || 1})\n\n` +
            `- **Status**: ${apple.use_apple_login === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Client ID**: ${apple.client_id || "N/A"}\n` +
            `- **Certification**: ${apple.use_certification === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: apple.shop_no,
        use_apple_login: apple.use_apple_login,
        client_id: apple.client_id,
        team_id: apple.team_id,
        key_id: apple.key_id,
        auth_key_file_name: apple.auth_key_file_name,
        use_certification: apple.use_certification,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_social_apple_setting",
    {
      title: "Get Cafe24 Apple Social Login Settings",
      description:
        "Retrieve Apple social login configuration including Client ID, Team ID, Key ID, and certification status.",
      inputSchema: SocialAppleParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_social_apple_setting,
  );

  server.registerTool(
    "cafe24_update_social_apple_setting",
    {
      title: "Update Cafe24 Apple Social Login Settings",
      description:
        "Update Apple social login configuration. Configure Client ID, Team ID, Key ID, Auth Key file (name and content), and certification options.",
      inputSchema: SocialAppleUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_social_apple_setting,
  );
}
