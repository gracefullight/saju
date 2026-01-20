import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type PointsSettingParams,
  PointsSettingParamsSchema,
  type PointsSettingUpdateParams,
  PointsSettingUpdateParamsSchema,
} from "@/schemas/points.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_get_points_setting(params: PointsSettingParams) {
  try {
    const data = await makeApiRequest("/admin/points/setting", "GET", undefined, {
      shop_no: params.shop_no,
    });
    const point = data.point || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Points/Mileage Settings (Shop #${point.shop_no})\n\n` +
            `- **Name**: ${point.name}\n` +
            `- **Issuance Standard**: ${point.point_issuance_standard === "C" ? "After Delivery" : "After Purchase Confirmation"}\n` +
            `- **Payment Period**: ${point.payment_period} days\n` +
            `- **Join Point**: ${point.join_point}\n` +
            `- **Format**: ${point.format}\n` +
            `- **Rounding**: ${point.round_type} / Unit: ${point.round_unit}\n` +
            `- **Email Consent Points**: ${point.use_email_agree_point === "T" ? "Yes" : "No"}\n` +
            `- **SMS Consent Points**: ${point.use_sms_agree_point === "T" ? "Yes" : "No"}\n` +
            `- **Consent Points Amount**: ${point.agree_point}\n`,
        },
      ],
      structuredContent: point as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_points_setting(params: PointsSettingUpdateParams) {
  try {
    const { shop_no, ...settings } = params;
    const data = await makeApiRequest("/admin/points/setting", "PUT", {
      shop_no,
      request: settings,
    });
    const point = data.point || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Points settings updated for Shop #${point.shop_no}`,
        },
      ],
      structuredContent: point as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_points_setting",
    {
      title: "Get Cafe24 Points Settings",
      description:
        "Retrieve points/mileage configuration settings including issuance standards, naming, formatting, and consent rewards.",
      inputSchema: PointsSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_points_setting,
  );

  server.registerTool(
    "cafe24_update_points_setting",
    {
      title: "Update Cafe24 Points Settings",
      description:
        "Update points/mileage configuration settings. Only provided fields will be updated.",
      inputSchema: PointsSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_update_points_setting,
  );
}
