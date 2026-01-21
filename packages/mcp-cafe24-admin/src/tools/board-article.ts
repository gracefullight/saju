import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type BoardArticleCreateInput,
  BoardArticleCreateSchema,
  type BoardArticleDeleteInput,
  BoardArticleDeleteSchema,
  type BoardArticlesSearchParams,
  BoardArticlesSearchParamsSchema,
  type BoardArticleUpdateInput,
  BoardArticleUpdateSchema,
} from "@/schemas/board-article.js";
import type {
  BoardArticleResponse,
  BoardArticlesResponse,
  DeleteBoardArticleResponse,
} from "@/types/index.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

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

export function registerBoardArticleTools(server: McpServer): void {
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
}
