import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type ThemePageRetrieveParams,
  ThemePageRetrieveParamsSchema,
  ThemesCountParamsSchema,
  type ThemesRetrieveParams,
  ThemesRetrieveParamsSchema,
  type ThemesSearchParams,
  ThemesSearchParamsSchema,
} from "../schemas/theme.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type {
  ThemePageResponse,
  ThemeResponse,
  ThemesCountResponse,
  ThemesResponse,
} from "../types/theme.js";

async function cafe24_list_themes(params: ThemesSearchParams) {
  try {
    const data = await makeApiRequest<ThemesResponse>("/admin/themes", "GET", undefined, {
      type: params.type,
      limit: params.limit,
      offset: params.offset,
    });

    const themes = data.themes || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${themes.length} themes\n\n` +
            themes
              .map(
                (t) =>
                  `## ${t.skin_name} (#${t.skin_no})\n- Code: ${t.skin_code}\n- Type: ${t.usage_type}\n- Language: ${t.language_code}\n- Published: ${t.published_in}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_themes(params: { type?: "pc" | "mobile" }) {
  try {
    const data = await makeApiRequest<ThemesCountResponse>(
      "/admin/themes/count",
      "GET",
      undefined,
      {
        type: params.type,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Total themes count: ${data.count}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_retrieve_theme(params: ThemesRetrieveParams) {
  try {
    const data = await makeApiRequest<ThemeResponse>(`/admin/themes/${params.skin_no}`, "GET");

    const theme = data.theme;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Theme Details: ${theme.skin_name} (#${theme.skin_no})\n\n` +
            `- Code: ${theme.skin_code}\n` +
            `- Usage Type: ${theme.usage_type}\n` +
            `- Editor Type: ${theme.editor_type}\n` +
            `- Language: ${theme.language_code}\n` +
            `- Published: ${theme.published_in}\n` +
            `- Created: ${theme.created_date}\n` +
            `- Updated: ${theme.updated_date || "N/A"}\n` +
            `- Lock: ${theme.skin_lock === "T" ? "Locked" : "Unlocked"}\n` +
            `- Preview: ${theme.preview_domain.join(", ")}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_retrieve_theme_page(params: ThemePageRetrieveParams) {
  try {
    const data = await makeApiRequest<ThemePageResponse>(
      `/admin/themes/${params.skin_no}/pages`,
      "GET",
      undefined,
      {
        path: params.path,
      },
    );

    const page = data.page;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Theme Page: ${page.path}\n\n` +
            `- Skin No: ${page.skin_no}\n` +
            `- Skin Code: ${page.skin_code}\n` +
            `- Path: ${page.path}\n` +
            (page.display_location ? `- Display Location: ${page.display_location}\n` : "") +
            `\n### Source Code:\n\`\`\`html\n${page.source}\n\`\`\``,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_themes",
    {
      title: "List Cafe24 Themes",
      description:
        "Retrieve a list of themes from Cafe24. Returns theme details including skin number, name, and usage type. Supports filtering by type (pc/mobile) and pagination.",
      inputSchema: ThemesSearchParamsSchema,
    },
    cafe24_list_themes,
  );

  server.registerTool(
    "cafe24_count_themes",
    {
      title: "Count Cafe24 Themes",
      description: "Retrieve the count of themes from Cafe24. Can be filtered by type (pc/mobile).",
      inputSchema: ThemesCountParamsSchema,
    },
    cafe24_count_themes,
  );

  server.registerTool(
    "cafe24_retrieve_theme",
    {
      title: "Retrieve Cafe24 Theme",
      description: "Retrieve detailed information about a specific theme by its skin number.",
      inputSchema: ThemesRetrieveParamsSchema,
    },
    cafe24_retrieve_theme,
  );

  server.registerTool(
    "cafe24_retrieve_theme_page",
    {
      title: "Retrieve Cafe24 Theme Page",
      description:
        "Retrieve the source code of a specific theme page by skin number and file path. Returns the HTML/template source code of the page.",
      inputSchema: ThemePageRetrieveParamsSchema,
    },
    cafe24_retrieve_theme_page,
  );
}
