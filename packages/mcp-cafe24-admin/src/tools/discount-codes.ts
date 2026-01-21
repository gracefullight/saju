import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type DiscountCodeCreateParams,
  DiscountCodeCreateParamsSchema,
  type DiscountCodeDeleteParams,
  DiscountCodeDeleteParamsSchema,
  type DiscountCodeDetailParams,
  DiscountCodeDetailParamsSchema,
  type DiscountCodesSearchParams,
  DiscountCodesSearchParamsSchema,
  type DiscountCodeUpdateParams,
  DiscountCodeUpdateParamsSchema,
} from "@/schemas/discount-codes.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  DiscountCodeCreateRequest,
  DiscountCodeDeleteResponse,
  DiscountCodeResponse,
  DiscountCodesListResponse,
  DiscountCodeUpdateRequest,
} from "@/types/index.js";

async function cafe24_list_discount_codes(params: DiscountCodesSearchParams) {
  try {
    const { shop_no, ...queryParams } = params;
    const data = await makeApiRequest<DiscountCodesListResponse>(
      "/admin/discountcodes",
      "GET",
      undefined,
      {
        shop_no: shop_no || 1,
        ...queryParams,
      },
    );

    const discountcodes = data.discountcodes || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Discount Codes (${discountcodes.length})\n\n` +
            (discountcodes.length > 0
              ? discountcodes
                  .map(
                    (code) =>
                      `## ${code.discount_code_name} (${code.discount_code})\n` +
                      `- **No**: ${code.discount_code_no}\n` +
                      `- **Available**: ${code.available_start_date} ~ ${code.available_end_date}\n` +
                      `- **Product Type**: ${code.available_product_type}\n` +
                      `- **Issued**: ${code.issued_count ?? "N/A"} / ${code.available_issue_count ?? "N/A"}\n`,
                  )
                  .join("\n")
              : "No discount codes found."),
        },
      ],
      structuredContent: {
        discountcodes,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_discount_code(params: DiscountCodeDetailParams) {
  try {
    const { shop_no, discount_code_no } = params;
    const data = await makeApiRequest<DiscountCodeResponse>(
      `/admin/discountcodes/${discount_code_no}`,
      "GET",
      undefined,
      { shop_no: shop_no || 1 },
    );

    const discountcode = data.discountcode;
    const availableProducts = discountcode.available_product?.length
      ? discountcode.available_product.join(", ")
      : "N/A";
    const availableCategories = discountcode.available_category?.length
      ? discountcode.available_category.join(", ")
      : "N/A";

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Discount Code ${discountcode.discount_code}\n\n` +
            `- **No**: ${discountcode.discount_code_no}\n` +
            `- **Name**: ${discountcode.discount_code_name}\n` +
            `- **Discount Value**: ${discountcode.discount_value ?? "N/A"}\n` +
            `- **Truncation Unit**: ${discountcode.discount_truncation_unit ?? "N/A"}\n` +
            `- **Max Discount**: ${discountcode.discount_max_price ?? "N/A"}\n` +
            `- **Available**: ${discountcode.available_start_date} ~ ${discountcode.available_end_date}\n` +
            `- **Product Type**: ${discountcode.available_product_type}\n` +
            `- **Products**: ${availableProducts}\n` +
            `- **Categories**: ${availableCategories}\n` +
            `- **Min Order**: ${discountcode.available_min_price ?? "N/A"}\n` +
            `- **Issue Limit**: ${discountcode.available_issue_count ?? "N/A"}\n` +
            `- **Applicable To**: ${discountcode.available_user ?? "N/A"}\n` +
            `- **Max Usage/User**: ${discountcode.max_usage_per_user ?? "N/A"}\n`,
        },
      ],
      structuredContent: {
        discountcode,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_discount_code(params: DiscountCodeCreateParams) {
  try {
    const { shop_no, request } = params;
    const requestBody: DiscountCodeCreateRequest = {
      shop_no: shop_no || 1,
      request,
    };

    const data = await makeApiRequest<DiscountCodeResponse>(
      "/admin/discountcodes",
      "POST",
      requestBody,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Discount code created: ${data.discountcode.discount_code} (No: ${data.discountcode.discount_code_no})`,
        },
      ],
      structuredContent: {
        discountcode: data.discountcode,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_discount_code(params: DiscountCodeUpdateParams) {
  try {
    const { shop_no, discount_code_no, request } = params;
    const requestBody: DiscountCodeUpdateRequest = {
      shop_no: shop_no || 1,
      request,
    };

    const data = await makeApiRequest<DiscountCodeResponse>(
      `/admin/discountcodes/${discount_code_no}`,
      "PUT",
      requestBody,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Discount code updated: ${data.discountcode.discount_code} (No: ${data.discountcode.discount_code_no})`,
        },
      ],
      structuredContent: {
        discountcode: data.discountcode,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_discount_code(params: DiscountCodeDeleteParams) {
  try {
    const { shop_no, discount_code_no } = params;
    const data = await makeApiRequest<DiscountCodeDeleteResponse>(
      `/admin/discountcodes/${discount_code_no}`,
      "DELETE",
      undefined,
      { shop_no: shop_no || 1 },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Discount code deleted: ${data.discountcode.discount_code_no}`,
        },
      ],
      structuredContent: {
        discountcode: data.discountcode,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_discount_codes",
    {
      title: "List Cafe24 Discount Codes",
      description: "Retrieve a list of discount codes.",
      inputSchema: DiscountCodesSearchParamsSchema,
    },
    cafe24_list_discount_codes,
  );

  server.registerTool(
    "cafe24_get_discount_code",
    {
      title: "Get Cafe24 Discount Code",
      description: "Retrieve a discount code by its number.",
      inputSchema: DiscountCodeDetailParamsSchema,
    },
    cafe24_get_discount_code,
  );

  server.registerTool(
    "cafe24_create_discount_code",
    {
      title: "Create Cafe24 Discount Code",
      description: "Create a new discount code.",
      inputSchema: DiscountCodeCreateParamsSchema,
    },
    cafe24_create_discount_code,
  );

  server.registerTool(
    "cafe24_update_discount_code",
    {
      title: "Update Cafe24 Discount Code",
      description: "Update an existing discount code.",
      inputSchema: DiscountCodeUpdateParamsSchema,
    },
    cafe24_update_discount_code,
  );

  server.registerTool(
    "cafe24_delete_discount_code",
    {
      title: "Delete Cafe24 Discount Code",
      description: "Delete a discount code by its number.",
      inputSchema: DiscountCodeDeleteParamsSchema,
    },
    cafe24_delete_discount_code,
  );
}
