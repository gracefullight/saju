import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type BoardAllCommentsSearchParams,
  BoardAllCommentsSearchParamsSchema,
  type BoardArticleCreateInput,
  BoardArticleCreateSchema,
  type BoardArticleDeleteInput,
  BoardArticleDeleteSchema,
  type BoardArticlesSearchParams,
  BoardArticlesSearchParamsSchema,
  type BoardArticleUpdateInput,
  BoardArticleUpdateSchema,
  type BoardCommentCreateInput,
  BoardCommentCreateSchema,
  type BoardCommentDeleteInput,
  BoardCommentDeleteSchema,
  type BoardCommentsSearchParams,
  BoardCommentsSearchParamsSchema,
  type BoardCommentTemplateCreateInput,
  BoardCommentTemplateCreateSchema,
  type BoardCommentTemplateDeleteInput,
  BoardCommentTemplateDeleteSchema,
  type BoardCommentTemplateDetailParams,
  BoardCommentTemplateDetailParamsSchema,
  type BoardCommentTemplatesSearchParams,
  BoardCommentTemplatesSearchParamsSchema,
  type BoardCommentTemplateUpdateInput,
  BoardCommentTemplateUpdateSchema,
  type BoardDetailParams,
  BoardDetailParamsSchema,
  type BoardSEODetailParams,
  BoardSEODetailParamsSchema,
  type BoardSEOUpdateInput,
  BoardSEOUpdateSchema,
  type BoardSettingParams,
  BoardSettingParamsSchema,
  type BoardSettingUpdateParams,
  BoardSettingUpdateParamsSchema,
  type BoardsSearchParams,
  BoardsSearchParamsSchema,
  type BoardUpdateInput,
  BoardUpdateSchema,
} from "@/schemas/board.js";
import type {
  Board,
  BoardArticleResponse,
  BoardArticlesResponse,
  BoardCommentResponse,
  BoardCommentsResponse,
  BoardCommentTemplateResponse,
  BoardCommentTemplatesResponse,
  BoardSEOResponse,
  DeleteBoardArticleResponse,
  DeleteBoardCommentResponse,
} from "@/types/index.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_boards(params: BoardsSearchParams) {
  try {
    const data = await makeApiRequest<{ boards: Board[]; total: number }>(
      "/admin/boards",
      "GET",
      undefined,
      params,
    );

    const boards = data.boards || [];
    const total = data.total || 0;

    const boardTypeMap: Record<number, string> = {
      1: "Administration",
      2: "General",
      3: "Resources",
      4: "Others",
      5: "Product",
      6: "Photo Gallery",
      7: "My Inquiries",
      11: "Memo",
    };

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total || boards.length} boards (showing ${boards.length})\n\n` +
            boards
              .map((b) => {
                const typeName = boardTypeMap[b.board_type] || `Unknown (${b.board_type})`;
                const status = [
                  b.use_board === "T" ? "In Use" : "Not In Use",
                  b.use_display === "T" ? "Displayed" : "Hidden",
                ].join(" | ");

                let details = `## ${b.board_name} (Board #${b.board_no})\n`;
                details += `- **Type**: ${typeName}\n`;
                details += `- **Status**: ${status}\n`;
                details += `- **Permissions**: Write(${b.write_permission}), Reply(${b.reply_permission})\n`;
                if (b.use_category === "T" && b.categories?.length > 0) {
                  details += `- **Categories**: ${b.categories.map((c) => c.name).join(", ")}\n`;
                }
                if (b.board_guide) {
                  details += `- **Guide**: ${b.board_guide}\n`;
                }
                return details + "\n";
              })
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: boards.length,
        offset: params.offset,
        boards,
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
    const { board_no, shop_no } = params;
    const data = await makeApiRequest<{ board: Board }>(
      `/admin/boards/${board_no}`,
      "GET",
      undefined,
      { shop_no },
    );
    const board = data.board;

    const boardTypeMap: Record<number, string> = {
      1: "Administration",
      2: "General",
      3: "Resources",
      4: "Others",
      5: "Product",
      6: "Photo Gallery",
      7: "My Inquiries",
      11: "Memo",
    };

    const typeName = boardTypeMap[board.board_type] || `Unknown (${board.board_type})`;
    const status = [
      board.use_board === "T" ? "In Use" : "Not In Use",
      board.use_display === "T" ? "Displayed" : "Hidden",
    ].join(" | ");

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## ${board.board_name} (Board #${board.board_no})\n\n` +
            `- **Type**: ${typeName}\n` +
            `- **Status**: ${status}\n` +
            `- **Permissions**: Write(${board.write_permission}), Reply(${board.reply_permission})\n` +
            `- **Page Size**: ${board.page_size} (${board.product_page_size} on product pages)\n` +
            (board.board_guide ? `- **Guide**: ${board.board_guide}\n` : ""),
        },
      ],
      structuredContent: board,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_update_board(params: BoardUpdateInput) {
  try {
    const { board_no, ...body } = params;
    const data = await makeApiRequest<{ board: Board }>(`/admin/boards/${board_no}`, "PUT", body);
    const board = data.board;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated configuration for ${board.board_name} (Board #${board.board_no}).`,
        },
      ],
      structuredContent: board,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_board_setting(params: BoardSettingParams) {
  try {
    const queryParams: Record<string, string | number> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest<{
      shop_no: number;
      admin_name: string;
      password_rules: string;
      linked_board: string | number;
      review_button_mode: string;
      spam_auto_prevention?: { type: "S" | "R" };
    }>("/admin/boards/setting", "GET", undefined, queryParams);
    const board = data;

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
      structuredContent: board,
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

    const data = await makeApiRequest<{
      shop_no: number;
      admin_name: string;
      password_rules: string;
      linked_board: string | number;
      review_button_mode: string;
      spam_auto_prevention?: { type: "S" | "R" };
    }>("/admin/boards/setting", "PUT", requestBody);
    const board = data;

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
      structuredContent: board,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_board_articles(params: BoardArticlesSearchParams) {
  try {
    const { board_no, ...queryParams } = params;
    const data = await makeApiRequest<BoardArticlesResponse>(
      `/admin/boards/${board_no}/articles`,
      "GET",
      undefined,
      queryParams,
    );
    const articles = data.articles || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Articles for Board #${board_no}\n\n` +
            articles
              .map(
                (a) =>
                  `## ${a.title} (Article #${a.article_no})\n` +
                  `- **Author**: ${a.writer} (${a.member_id || "Guest"})\n` +
                  `- **Date**: ${a.created_date}\n` +
                  `- **Status**: ${a.display === "T" ? "Public" : "Private"} | ${a.notice === "T" ? "Notice" : "Normal"}\n` +
                  `- **Content Preview**: ${a.content.substring(0, 100)}${a.content.length > 100 ? "..." : ""}\n`,
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

async function cafe24_create_board_articles(params: BoardArticleCreateInput) {
  try {
    const { board_no, ...body } = params;
    const data = await makeApiRequest<BoardArticlesResponse>(
      `/admin/boards/${board_no}/articles`,
      "POST",
      body,
    );
    const articles = data.articles || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created ${articles.length} articles on Board #${board_no}.`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_board_article(params: BoardArticleUpdateInput) {
  try {
    const { board_no, article_no, ...body } = params;
    const data = await makeApiRequest<BoardArticleResponse>(
      `/admin/boards/${board_no}/articles/${article_no}`,
      "PUT",
      body,
    );
    const article = data.article;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated article #${article.article_no} on Board #${article.board_no}.`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_board_article(params: BoardArticleDeleteInput) {
  try {
    const { board_no, article_no, shop_no } = params;
    const data = await makeApiRequest<DeleteBoardArticleResponse>(
      `/admin/boards/${board_no}/articles/${article_no}`,
      "DELETE",
      undefined,
      { shop_no },
    );
    const article = data.article;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted article #${article.article_no} from Board #${article.board_no}.`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_all_board_comments(params: BoardAllCommentsSearchParams) {
  try {
    const { board_no, ...queryParams } = params;
    const data = await makeApiRequest<BoardCommentsResponse>(
      `/admin/boards/${board_no}/comments`,
      "GET",
      undefined,
      queryParams,
    );
    const comments = data.comments || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# All Comments for Board #${board_no}\n\n` +
            comments
              .map(
                (c) =>
                  `## Comment #${c.comment_no} (Article #${c.article_no})\n` +
                  `- **Author**: ${c.writer} (${c.member_id || "Guest"})\n` +
                  `- **Date**: ${c.created_date}\n` +
                  `- **Rating**: ${c.rating}\n` +
                  `- **Status**: ${c.secret === "T" ? "Secret" : "Public"}\n` +
                  `- **Content**: ${c.content}\n`,
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

async function cafe24_list_board_comments(params: BoardCommentsSearchParams) {
  try {
    const { board_no, article_no, ...queryParams } = params;
    const data = await makeApiRequest<BoardCommentsResponse>(
      `/admin/boards/${board_no}/articles/${article_no}/comments`,
      "GET",
      undefined,
      queryParams,
    );
    const comments = data.comments || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Comments for Article #${article_no} (Board #${board_no})\n\n` +
            comments
              .map(
                (c) =>
                  `## Comment #${c.comment_no}${c.parent_comment_no ? ` (Reply to #${c.parent_comment_no})` : ""}\n` +
                  `- **Author**: ${c.writer} (${c.member_id || "Guest"})\n` +
                  `- **Date**: ${c.created_date}\n` +
                  `- **Rating**: ${c.rating}\n` +
                  `- **Status**: ${c.secret === "T" ? "Secret" : "Public"}\n` +
                  `- **Content**: ${c.content}\n`,
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

async function cafe24_create_board_comment(params: BoardCommentCreateInput) {
  try {
    const { board_no, article_no, ...body } = params;
    const data = await makeApiRequest<BoardCommentResponse>(
      `/admin/boards/${board_no}/articles/${article_no}/comments`,
      "POST",
      body,
    );
    const comment = data.comment;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created comment #${comment.comment_no} on Article #${comment.article_no} (Board #${comment.board_no}).`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_board_comment(params: BoardCommentDeleteInput) {
  try {
    const { board_no, article_no, comment_no, shop_no } = params;
    const data = await makeApiRequest<DeleteBoardCommentResponse>(
      `/admin/boards/${board_no}/articles/${article_no}/comments/${comment_no}`,
      "DELETE",
      undefined,
      { shop_no },
    );
    const comment = data.comment;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted comment #${comment.comment_no} from Article #${comment.article_no} (Board #${comment.board_no}).`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_board_seo(params: BoardSEODetailParams) {
  try {
    const { board_no, ...queryParams } = params;
    const data = await makeApiRequest<BoardSEOResponse>(
      `/admin/boards/${board_no}/seo`,
      "GET",
      undefined,
      queryParams,
    );
    const seo = data.seo;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## SEO Settings for Board #${seo.board_no} (Shop #${seo.shop_no})\n\n` +
            `- **Meta Title**: ${seo.meta_title}\n` +
            `- **Meta Author**: ${seo.meta_author}\n` +
            `- **Meta Description**: ${seo.meta_description}\n` +
            `- **Meta Keywords**: ${seo.meta_keywords}\n`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_board_seo(params: BoardSEOUpdateInput) {
  try {
    const { board_no, ...body } = params;
    const data = await makeApiRequest<BoardSEOResponse>(
      `/admin/boards/${board_no}/seo`,
      "PUT",
      body,
    );
    const seo = data.seo;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated SEO settings for Board #${seo.board_no} (Shop #${seo.shop_no}).`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_board_comment_templates(params: BoardCommentTemplatesSearchParams) {
  try {
    const data = await makeApiRequest<BoardCommentTemplatesResponse>(
      "/admin/commenttemplates",
      "GET",
      undefined,
      params,
    );
    const templates = data.commenttemplates || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Board Comment Templates\n\n` +
            templates
              .map(
                (t) =>
                  `## ${t.title} (Template #${t.comment_no})\n` +
                  `- **Board Type**: ${t.board_type}\n` +
                  `- **Created**: ${t.created_date}\n` +
                  `- **Content**: ${t.content}\n`,
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

async function cafe24_get_board_comment_template(params: BoardCommentTemplateDetailParams) {
  try {
    const { comment_no, shop_no } = params;
    const data = await makeApiRequest<BoardCommentTemplateResponse>(
      `/admin/commenttemplates/${comment_no}`,
      "GET",
      undefined,
      { shop_no },
    );
    const template = data.commenttemplate;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## ${template.title} (Template #${template.comment_no})\n\n` +
            `- **Board Type**: ${template.board_type}\n` +
            `- **Created**: ${template.created_date}\n` +
            `- **Content**: ${template.content}\n`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_board_comment_template(params: BoardCommentTemplateCreateInput) {
  try {
    const data = await makeApiRequest<BoardCommentTemplateResponse>(
      "/admin/commenttemplates",
      "POST",
      params,
    );
    const template = data.commenttemplate;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created comment template "${template.title}" (Template #${template.comment_no}).`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_board_comment_template(params: BoardCommentTemplateUpdateInput) {
  try {
    const { comment_no, ...body } = params;
    const data = await makeApiRequest<BoardCommentTemplateResponse>(
      `/admin/commenttemplates/${comment_no}`,
      "PUT",
      body,
    );
    const template = data.commenttemplate;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated comment template "${template.title}" (Template #${template.comment_no}).`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_board_comment_template(params: BoardCommentTemplateDeleteInput) {
  try {
    const { comment_no, shop_no } = params;
    const data = await makeApiRequest<BoardCommentTemplateResponse>(
      `/admin/commenttemplates/${comment_no}`,
      "DELETE",
      undefined,
      { shop_no },
    );
    const template = data.commenttemplate;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted comment template "${template.title}" (Template #${template.comment_no}).`,
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
    "cafe24_update_board",
    {
      title: "Update Cafe24 Board",
      description:
        "Update the configuration of a specific board, including its name, type, and various board features.",
      inputSchema: BoardUpdateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_board,
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

  server.registerTool(
    "cafe24_list_board_articles",
    {
      title: "List Board Articles",
      description:
        "Retrieve a list of posts from a specific board. Supports comprehensive filtering by date, author, content, and post type.",
      inputSchema: BoardArticlesSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_board_articles,
  );

  server.registerTool(
    "cafe24_create_board_articles",
    {
      title: "Create Board Articles",
      description: "Create one or more posts on a specific board.",
      inputSchema: BoardArticleCreateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_board_articles,
  );

  server.registerTool(
    "cafe24_update_board_article",
    {
      title: "Update Board Article",
      description: "Update an existing post on a specific board.",
      inputSchema: BoardArticleUpdateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_board_article,
  );

  server.registerTool(
    "cafe24_delete_board_article",
    {
      title: "Delete Board Article",
      description: "Delete a specific post from a board.",
      inputSchema: BoardArticleDeleteSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_board_article,
  );

  server.registerTool(
    "cafe24_list_all_board_comments",
    {
      title: "List All Board Comments",
      description: "Retrieve a list of all comments for a specific board.",
      inputSchema: BoardAllCommentsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_all_board_comments,
  );

  server.registerTool(
    "cafe24_list_board_comments",
    {
      title: "List Board Comments",
      description: "Retrieve a list of comments for a specific article.",
      inputSchema: BoardCommentsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_board_comments,
  );

  server.registerTool(
    "cafe24_create_board_comment",
    {
      title: "Create Board Comment",
      description: "Create a new comment or reply to a comment on a specific article.",
      inputSchema: BoardCommentCreateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_board_comment,
  );

  server.registerTool(
    "cafe24_delete_board_comment",
    {
      title: "Delete Board Comment",
      description: "Delete a specific comment from an article.",
      inputSchema: BoardCommentDeleteSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_board_comment,
  );

  server.registerTool(
    "cafe24_get_board_seo",
    {
      title: "Get Board SEO Settings",
      description: "Retrieve SEO settings (meta tags) for a specific board.",
      inputSchema: BoardSEODetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_board_seo,
  );

  server.registerTool(
    "cafe24_update_board_seo",
    {
      title: "Update Board SEO Settings",
      description: "Update SEO settings (meta tags) for a specific board.",
      inputSchema: BoardSEOUpdateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_board_seo,
  );

  server.registerTool(
    "cafe24_list_board_comment_templates",
    {
      title: "List Board Comment Templates",
      description: "Retrieve a list of frequently used board comment templates (canned responses).",
      inputSchema: BoardCommentTemplatesSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_board_comment_templates,
  );

  server.registerTool(
    "cafe24_get_board_comment_template",
    {
      title: "Get Board Comment Template",
      description: "Retrieve details of a specific board comment template.",
      inputSchema: BoardCommentTemplateDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_board_comment_template,
  );

  server.registerTool(
    "cafe24_create_board_comment_template",
    {
      title: "Create Board Comment Template",
      description: "Create a new frequently used board comment template.",
      inputSchema: BoardCommentTemplateCreateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_board_comment_template,
  );

  server.registerTool(
    "cafe24_update_board_comment_template",
    {
      title: "Update Board Comment Template",
      description: "Update an existing board comment template.",
      inputSchema: BoardCommentTemplateUpdateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_board_comment_template,
  );

  server.registerTool(
    "cafe24_delete_board_comment_template",
    {
      title: "Delete Board Comment Template",
      description: "Delete a specific board comment template.",
      inputSchema: BoardCommentTemplateDeleteSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_board_comment_template,
  );
}
