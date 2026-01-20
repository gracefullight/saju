import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type ProductSettingParams,
  ProductSettingParamsSchema,
  type ProductSettingUpdateParams,
  ProductSettingUpdateParamsSchema,
} from "@/schemas/productsetting.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_get_product_common_setting(params: ProductSettingParams) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/products/setting", "GET", undefined, queryParams);
    const product = data.product || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## General Product Settings (Shop #${product.shop_no || 1})\n\n` +
            `- **Adult Certification**: ${product.use_adult_certification === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Stock Display**: ${product.product_stock_display === "A" ? "All" : product.product_stock_display === "S" ? "Sold Out Only" : "Hidden"}\n`,
        },
      ],
      structuredContent: {
        shop_no: product.shop_no ?? 1,
        use_adult_certification: product.use_adult_certification,
        use_review_board: product.use_review_board,
        use_qna_board: product.use_qna_board,
        review_board_no: product.review_board_no,
        qna_board_no: product.qna_board_no,
        product_stock_display: product.product_stock_display,
        use_basket_discount: product.use_basket_discount,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product_common_setting(params: ProductSettingUpdateParams) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, any> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/products/setting", "PUT", requestBody);
    const product = data.product || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## General Product Settings Updated (Shop #${product.shop_no || 1})\n\n` +
            `- **Adult Certification**: ${product.use_adult_certification === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: product.shop_no ?? 1,
        use_adult_certification: product.use_adult_certification,
        use_review_board: product.use_review_board,
        use_qna_board: product.use_qna_board,
        review_board_no: product.review_board_no,
        qna_board_no: product.qna_board_no,
        product_stock_display: product.product_stock_display,
        use_basket_discount: product.use_basket_discount,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_product_common_setting",
    {
      title: "Get Cafe24 General Product Settings",
      description:
        "Retrieve general product settings including adult certification, board associations, and stock display options.",
      inputSchema: ProductSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product_common_setting,
  );

  server.registerTool(
    "cafe24_update_product_common_setting",
    {
      title: "Update Cafe24 General Product Settings",
      description:
        "Update general product settings. Configure adult certification, review/Q&A board links, stock display visibility (All/Sold Out/Hidden), and basket discounts.",
      inputSchema: ProductSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product_common_setting,
  );
}
