import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type BoardDetailParams,
  BoardDetailParamsSchema,
  type BoardSettingParams,
  BoardSettingParamsSchema,
  type BoardSettingUpdateParams,
  BoardSettingUpdateParamsSchema,
  type BoardsSearchParams,
  BoardsSearchParamsSchema,
  type SpamAutoPrevention,
  SpamAutoPreventionSchema,
} from "@/schemas/board.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { Board } from "../types.js";

async function cafe24_list_boards(params: BoardsSearchParams) {
  try {
    const data = await makeApiRequest<{ boards: Board[]; total: number }>(
      "/admin/boards",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
        ...(params.board_no ? { board_no: params.board_no } : {}),
      },
    );

    const boards = data.boards || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} boards (showing ${boards.length})\n\n` +
            boards
              .map(
                (b) =>
                  `## ${b.board_name} (Board #${b.board_no})\n` +
                  `- **Type**: ${b.board_type}\n` +
                  `- **Status**: ${b.display ? "Displayed" : "Hidden"} | ${b.use ? "In Use" : "Not In Use"}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: boards.length,
        offset: params.offset,
        boards: boards.map((b) => ({
          id: b.board_no.toString(),
          name: b.board_name,
          type: b.board_type,
          display: b.display,
          use: b.use,
        })),
        has_more: total > params.offset + boards.length,
        ...(total > params.offset + boards.length
          ? {
              next_offset: params.offset + boards.length,
            }
          : {}),
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_get_board(params: BoardDetailParams) {
  try {
    const data = await makeApiRequest<{ board: Board }>(`/admin/boards/${params.board_no}`, "GET");
    const board = data.board || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Board Details\n\n` +
            `- **Board No**: ${board.board_no}\n` +
            `- **Board Name**: ${board.board_name}\n` +
            `- **Type**: ${board.board_type}\n` +
            `- **Status**: ${board.display ? "Displayed" : "Hidden"} | ${board.use ? "In Use" : "Not In Use"}\n`,
        },
      ],
      structuredContent: {
        id: board.board_no.toString(),
        name: board.board_name,
        type: board.board_type,
        display: board.display,
        use: board.use,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_get_board_setting(params: BoardSettingParams) {
  try {
    const queryParams: Record<string, string | number> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/boards/setting", "GET", undefined, queryParams);
    const board = data.board || data;

    const adminNameMap: Record<string, string> = {
      name: "Operator Name",
      nickname: "Operator Nickname",
      shopname: "Shop Name",
      storename: "Store Name",
    };

    const reviewModeMap: Record<string, string> = {
      all: "Regardless of order status",
      shipbegin_date: "Shipping started",
      shipend_date: "After delivery",
    };

    const spamTypeMap: Record<string, string> = {
      S: "Security code",
      R: "Google reCAPTCHA",
    };

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Board Settings (Shop #${board.shop_no || 1})\n\n` +
            `- **Admin Name**: ${adminNameMap[board.admin_name] || board.admin_name}\n` +
            `- **Password Rules**: ${board.password_rules === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Linked Board**: ${board.linked_board === "F" ? "Disabled" : `Board #${board.linked_board}`}\n` +
            `- **Review Button Mode**: ${reviewModeMap[board.review_button_mode] || board.review_button_mode}\n` +
            `- **Spam Prevention**: ${board.spam_auto_prevention ? spamTypeMap[board.spam_auto_prevention.type] : "Not configured"}\n`,
        },
      ],
      structuredContent: {
        shop_no: board.shop_no ?? 1,
        admin_name: board.admin_name,
        password_rules: board.password_rules,
        linked_board: board.linked_board,
        review_button_mode: board.review_button_mode,
        spam_auto_prevention: board.spam_auto_prevention,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_board_setting(params: BoardSettingUpdateParams) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/boards/setting", "PUT", requestBody);
    const board = data.board || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Board Settings Updated (Shop #${board.shop_no || 1})\n\n` +
            `- **Admin Name**: ${board.admin_name}\n` +
            `- **Password Rules**: ${board.password_rules === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Review Button Mode**: ${board.review_button_mode}\n`,
        },
      ],
      structuredContent: {
        shop_no: board.shop_no ?? 1,
        admin_name: board.admin_name,
        password_rules: board.password_rules,
        linked_board: board.linked_board,
        review_button_mode: board.review_button_mode,
        spam_auto_prevention: board.spam_auto_prevention,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_boards",
    {
      title: "List Cafe24 Boards",
      description:
        "Retrieve a list of boards from Cafe24. Returns board details including board number, name, type, display status, and usage status. Supports pagination and filtering by board number.",
      inputSchema: BoardsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_boards,
  );

  server.registerTool(
    "cafe24_get_board",
    {
      title: "Get Cafe24 Board Details",
      description:
        "Retrieve detailed information about a specific board by board number. Returns complete board details including type and status.",
      inputSchema: BoardDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_board,
  );

  server.registerTool(
    "cafe24_get_board_setting",
    {
      title: "Get Cafe24 Board Settings",
      description:
        "Retrieve board settings including admin name, password rules, linked board, review button mode, and spam prevention settings.",
      inputSchema: BoardSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_board_setting,
  );

  server.registerTool(
    "cafe24_update_board_setting",
    {
      title: "Update Cafe24 Board Settings",
      description:
        "Update board settings including admin name (name/nickname/shopname/storename), password rules, linked board, review button mode, and spam prevention (security code or Google reCAPTCHA).",
      inputSchema: BoardSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_board_setting,
  );
}
