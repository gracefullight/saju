import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type ArticleIconsSearchParams,
  ArticleIconsSearchParamsSchema,
  type ArticleIconUpdateInput,
  ArticleIconUpdateSchema,
} from "@/schemas/article-icon.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { IconResponse, IconsResponse } from "@/types/index.js";

async function cafe24_list_article_icons(params: ArticleIconsSearchParams) {
  try {
    const validatedParams = ArticleIconsSearchParamsSchema.parse(params);
    const response = await makeApiRequest<IconsResponse>(
      "/admin/icons",
      "GET",
      undefined,
      validatedParams,
    );

    if (!response.icons || response.icons.length === 0) {
      return {
        content: [{ type: "text" as const, text: "No icons found." }],
      };
    }

    const icons = response.icons;
    let markdown = "# Article Icons\n\n";
    markdown += `Found ${icons.length} icons for ${validatedParams.type}.\n\n`;

    for (const icon of icons) {
      markdown += `### [${icon.id}] ${icon.description || "No description"}\n`;
      markdown += `- **Group**: ${icon.group_code}\n`;
      markdown += `- **Display**: ${icon.display}\n`;
      markdown += `- **Path**: ${icon.path}\n\n`;
    }

    return {
      content: [{ type: "text" as const, text: markdown }],
      structuredContent: response,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_update_article_icon(params: ArticleIconUpdateInput) {
  try {
    const { shop_no, ...rest } = ArticleIconUpdateSchema.parse(params);
    const response = await makeApiRequest<IconResponse>(
      "/admin/icons",
      "PUT",
      { request: rest },
      { shop_no },
    );

    const icon = response.icons;
    let markdown = "# Icon Updated Successfully\n\n";
    markdown += `- **ID**: ${icon.id}\n`;
    markdown += `- **Description**: ${icon.description}\n`;
    markdown += `- **Display**: ${icon.display}\n`;
    markdown += `- **Path**: ${icon.path}\n`;

    return {
      content: [{ type: "text" as const, text: markdown }],
      structuredContent: response,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export function registerArticleIconTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_article_icons",
    {
      title: "List Article Icons",
      description: "Retrieve a list of icons for products, boards, cards, and events.",
      inputSchema: ArticleIconsSearchParamsSchema,
    },
    cafe24_list_article_icons,
  );

  server.registerTool(
    "cafe24_update_article_icon",
    {
      title: "Update Article Icon",
      description: "Update the display settings or path of an icon.",
      inputSchema: ArticleIconUpdateSchema,
    },
    cafe24_update_article_icon,
  );
}
