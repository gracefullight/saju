import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type ImageSettingParams,
  ImageSettingParamsSchema,
  type ImageSettingUpdateParams,
  ImageSettingUpdateParamsSchema,
} from "@/schemas/image.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

async function cafe24_get_image_setting(params: ImageSettingParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/images/setting", "GET", undefined, queryParams);
    const responseData = data as { image?: Record<string, unknown> } | Record<string, unknown>;
    const image = (responseData.image || responseData) as Record<string, unknown>;
    const sizes = (image.product_image_size || {}) as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text: formatImageSizes(image, sizes),
        },
      ],
      structuredContent: {
        shop_no: image.shop_no ?? 1,
        product_image_size: sizes,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

function formatImageSizes(image: Record<string, unknown>, sizes: Record<string, unknown>): string {
  return (
    `## Image Settings (Shop #${image.shop_no || 1})\n\n` +
    `### Product Image Sizes\n` +
    `| Type | Width | Height |\n` +
    `|------|-------|--------|\n` +
    `| Detail | ${sizes.detail_image_width || "N/A"} | ${sizes.detail_image_height || "N/A"} |\n` +
    `| List | ${sizes.list_image_width || "N/A"} | ${sizes.list_image_height || "N/A"} |\n` +
    `| Tiny | ${sizes.tiny_image_width || "N/A"} | ${sizes.tiny_image_height || "N/A"} |\n` +
    `| Zoom | ${sizes.zoom_image_width || "N/A"} | ${sizes.zoom_image_height || "N/A"} |\n` +
    `| Small | ${sizes.small_image_width || "N/A"} | ${sizes.small_image_height || "N/A"} |\n`
  );
}

async function cafe24_update_image_setting(params: ImageSettingUpdateParams) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/images/setting", "PUT", requestBody);
    const responseData = data as { image?: Record<string, unknown> } | Record<string, unknown>;
    const image = (responseData.image || responseData) as Record<string, unknown>;
    const sizes = (image.product_image_size || {}) as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Image Settings Updated (Shop #${image.shop_no || 1})\n\n` +
            `- **Detail**: ${sizes.detail_image_width}x${sizes.detail_image_height}\n` +
            `- **List**: ${sizes.list_image_width}x${sizes.list_image_height}\n` +
            `- **Zoom**: ${sizes.zoom_image_width}x${sizes.zoom_image_height}\n`,
        },
      ],
      structuredContent: {
        shop_no: image.shop_no ?? 1,
        product_image_size: sizes,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_image_setting",
    {
      title: "Get Cafe24 Image Settings",
      description:
        "Retrieve product image size settings including detail, list, tiny, zoom, and small image dimensions (width and height).",
      inputSchema: ImageSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_image_setting,
  );

  server.registerTool(
    "cafe24_update_image_setting",
    {
      title: "Update Cafe24 Image Settings",
      description:
        "Update product image size settings. Includes detail, list, tiny, zoom, and small image dimensions (width and height in pixels).",
      inputSchema: ImageSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_image_setting,
  );
}
