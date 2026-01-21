import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CouponIssuanceCustomersSearchParams,
  CouponIssuanceCustomersSearchParamsSchema,
} from "@/schemas/coupon-issuance-customers.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { CouponIssuanceCustomersResponse } from "@/types/index.js";

async function cafe24_list_coupon_issuance_customers(params: CouponIssuanceCustomersSearchParams) {
  try {
    const { coupon_no, ...queryParams } = params;
    const data = await makeApiRequest<CouponIssuanceCustomersResponse>(
      `/admin/coupons/${coupon_no}/issuancecustomers`,
      "GET",
      undefined,
      queryParams,
    );

    const issuancecustomers = data.issuancecustomers || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Coupon Issuance Customers (Coupon: ${coupon_no})\n\n` +
            (issuancecustomers.length > 0
              ? issuancecustomers
                  .map(
                    (c) =>
                      `## ${c.member_id}\n` +
                      `- **Group**: ${c.group_no}\n` +
                      `- **Issued**: ${c.issued_date}\n` +
                      `- **Expiration**: ${c.expiration_date}\n` +
                      `- **Used**: ${c.used_coupon === "T" ? "Yes" : "No"}\n` +
                      `- **Used Date**: ${c.used_date ?? "N/A"}\n` +
                      `- **Order**: ${c.related_order_id ?? "N/A"}\n`,
                  )
                  .join("\n")
              : "No issuance customers found."),
        },
      ],
      structuredContent: {
        coupon_no,
        count: issuancecustomers.length,
        issuancecustomers,
        links: data.links,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_coupon_issuance_customers",
    {
      title: "List Cafe24 Coupon Issuance Customers",
      description:
        "Retrieve issuance customers for a specific coupon. Supports filtering by member, group, and pagination.",
      inputSchema: CouponIssuanceCustomersSearchParamsSchema,
    },
    cafe24_list_coupon_issuance_customers,
  );
}
