import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CouponIssueCreateParams,
  CouponIssueCreateParamsSchema,
  type CouponIssuesSearchParams,
  CouponIssuesSearchParamsSchema,
} from "@/schemas/coupon-issues.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  CouponIssueCreateRequest,
  CouponIssueCreateResponse,
  CouponIssuesListResponse,
} from "@/types/index.js";

async function cafe24_list_coupon_issues(params: CouponIssuesSearchParams) {
  try {
    const { coupon_no, ...queryParams } = params;
    const data = await makeApiRequest<CouponIssuesListResponse>(
      `/admin/coupons/${coupon_no}/issues`,
      "GET",
      undefined,
      queryParams,
    );

    const issues = data.issues || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Coupon Issues (Coupon: ${coupon_no})\n\n` +
            (issues.length > 0
              ? issues
                  .map(
                    (issue) =>
                      `## ${issue.issue_no}\n` +
                      `- **Member**: ${issue.member_id}\n` +
                      `- **Group**: ${issue.group_no}\n` +
                      `- **Issued**: ${issue.issued_date}\n` +
                      `- **Expiration**: ${issue.expiration_date}\n` +
                      `- **Used**: ${issue.used_coupon === "T" ? "Yes" : "No"}\n` +
                      `- **Used Date**: ${issue.used_date ?? "N/A"}\n` +
                      `- **Order**: ${issue.related_order_id ?? "N/A"}\n`,
                  )
                  .join("\n")
              : "No coupon issues found."),
        },
      ],
      structuredContent: {
        coupon_no,
        count: issues.length,
        issues,
        links: data.links,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_coupon_issues(params: CouponIssueCreateParams) {
  try {
    const { coupon_no, shop_no, request } = params;
    const requestBody: CouponIssueCreateRequest = {
      shop_no: shop_no || 1,
      request,
    };

    const data = await makeApiRequest<CouponIssueCreateResponse>(
      `/admin/coupons/${coupon_no}/issues`,
      "POST",
      requestBody,
    );

    const issuedCount = data.issues?.count?.[coupon_no] ?? 0;

    return {
      content: [
        {
          type: "text" as const,
          text: `Issued ${issuedCount} coupon(s) for coupon ${coupon_no}.`,
        },
      ],
      structuredContent: {
        issues: data.issues,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_coupon_issues",
    {
      title: "List Cafe24 Coupon Issues",
      description:
        "Retrieve coupon issue history for a specific coupon. Supports member/group filters and pagination.",
      inputSchema: CouponIssuesSearchParamsSchema,
    },
    cafe24_list_coupon_issues,
  );

  server.registerTool(
    "cafe24_create_coupon_issues",
    {
      title: "Create Cafe24 Coupon Issues",
      description: "Issue a coupon to members, groups, or all customers.",
      inputSchema: CouponIssueCreateParamsSchema,
    },
    cafe24_create_coupon_issues,
  );
}
