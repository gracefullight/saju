import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type SerialCouponIssueCreateParams,
  SerialCouponIssueCreateParamsSchema,
  type SerialCouponIssuesSearchParams,
  SerialCouponIssuesSearchParamsSchema,
} from "@/schemas/serialcoupon-issue.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  SerialCouponIssueCreateRequest,
  SerialCouponIssueCreateResponse,
  SerialCouponIssueListResponse,
} from "@/types/index.js";

async function cafe24_list_serial_coupon_issues(params: SerialCouponIssuesSearchParams) {
  try {
    const { shop_no, coupon_no, ...rest } = params;
    const data = await makeApiRequest<SerialCouponIssueListResponse>(
      `/admin/serialcoupons/${coupon_no}/issues`,
      "GET",
      undefined,
      {
        shop_no: shop_no || 1,
        ...rest,
      },
    );

    const serialcoupons = data.serialcoupons || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${serialcoupons.length} serial coupon issue(s).\n\n` +
            serialcoupons
              .map(
                (issue) =>
                  `## ${issue.serial_code}\n` +
                  `- **Member**: ${issue.member_id || "N/A"}\n` +
                  `- **Verified**: ${issue.verify}\n` +
                  `- **Verified At**: ${issue.verify_datetime || "N/A"}\n` +
                  `- **Used At**: ${issue.used_datetime || "N/A"}\n` +
                  `- **Deleted**: ${issue.deleted}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        serialcoupons,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_create_serial_coupon_issues(params: SerialCouponIssueCreateParams) {
  try {
    const { shop_no, coupon_no, request } = params;
    const requestBody: SerialCouponIssueCreateRequest = {
      shop_no: shop_no || 1,
      request,
    };

    const data = await makeApiRequest<SerialCouponIssueCreateResponse>(
      `/admin/serialcoupons/${coupon_no}/issues`,
      "POST",
      requestBody,
    );

    const serialcoupons = data.serialcoupons || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Issued ${serialcoupons.length} serial coupon code(s).\n\n` +
            serialcoupons.map((issue) => `- ${issue.serial_code}`).join("\n"),
        },
      ],
      structuredContent: {
        serialcoupons,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_serial_coupon_issues",
    {
      title: "List Cafe24 Serial Coupon Issues",
      description: "Retrieve issued serial coupon codes for a specific coupon.",
      inputSchema: SerialCouponIssuesSearchParamsSchema,
    },
    cafe24_list_serial_coupon_issues,
  );

  server.registerTool(
    "cafe24_create_serial_coupon_issues",
    {
      title: "Create Cafe24 Serial Coupon Issues",
      description: "Issue serial coupon codes for a specific coupon.",
      inputSchema: SerialCouponIssueCreateParamsSchema,
    },
    cafe24_create_serial_coupon_issues,
  );
}
