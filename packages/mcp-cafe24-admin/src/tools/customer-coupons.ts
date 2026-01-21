import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CustomerCouponDeleteParams,
  CustomerCouponDeleteParamsSchema,
  type CustomerCouponsCountParams,
  CustomerCouponsCountParamsSchema,
  type CustomerCouponsSearchParams,
  CustomerCouponsSearchParamsSchema,
} from "@/schemas/customer-coupons.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  CustomerCouponDeleteResponse,
  CustomerCouponsCountResponse,
  CustomerCouponsListResponse,
} from "@/types/index.js";

async function cafe24_list_customer_coupons(params: CustomerCouponsSearchParams) {
  try {
    const { member_id, ...queryParams } = params;
    const data = await makeApiRequest<CustomerCouponsListResponse>(
      `/admin/customers/${member_id}/coupons`,
      "GET",
      undefined,
      queryParams,
    );

    const coupons = data.coupons || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Customer Coupons (${member_id})\n\n` +
            (coupons.length > 0
              ? coupons
                  .map(
                    (coupon) =>
                      `## ${coupon.coupon_name} (${coupon.coupon_no})\n` +
                      `- **Issue No**: ${coupon.issue_no}\n` +
                      `- **Benefit Type**: ${coupon.benefit_type}\n` +
                      `- **Benefit Price**: ${coupon.benefit_price ?? "N/A"}\n` +
                      `- **Benefit Percentage**: ${coupon.benefit_percentage ?? "N/A"}\n` +
                      `- **Issued**: ${coupon.issued_date}\n` +
                      `- **Available**: ${coupon.available_begin_datetime} ~ ${coupon.available_end_datetime}\n`,
                  )
                  .join("\n")
              : "No coupons found for this customer."),
        },
      ],
      structuredContent: {
        member_id,
        count: coupons.length,
        coupons,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_customer_coupons(params: CustomerCouponsCountParams) {
  try {
    const { member_id, ...queryParams } = params;
    const data = await makeApiRequest<CustomerCouponsCountResponse>(
      `/admin/customers/${member_id}/coupons/count`,
      "GET",
      undefined,
      queryParams,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Customer ${member_id} has ${data.count} coupon(s).`,
        },
      ],
      structuredContent: {
        member_id,
        count: data.count,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_customer_coupon(params: CustomerCouponDeleteParams) {
  try {
    const { member_id, coupon_no, issue_no, ...queryParams } = params;
    if (issue_no) {
      queryParams.issue_no = issue_no;
    }

    const data = await makeApiRequest<CustomerCouponDeleteResponse>(
      `/admin/customers/${member_id}/coupons/${coupon_no}`,
      "DELETE",
      undefined,
      queryParams,
    );

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Deleted coupon ${data.coupon.coupon_no} for ${member_id}. ` +
            `Issue No(s): ${data.coupon.issue_no.join(", ")}`,
        },
      ],
      structuredContent: {
        coupon: data.coupon,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_customer_coupons",
    {
      title: "List Cafe24 Customer Coupons",
      description: "Retrieve coupons issued to a specific member.",
      inputSchema: CustomerCouponsSearchParamsSchema,
    },
    cafe24_list_customer_coupons,
  );

  server.registerTool(
    "cafe24_count_customer_coupons",
    {
      title: "Count Cafe24 Customer Coupons",
      description: "Retrieve the count of coupons issued to a specific member.",
      inputSchema: CustomerCouponsCountParamsSchema,
    },
    cafe24_count_customer_coupons,
  );

  server.registerTool(
    "cafe24_delete_customer_coupon",
    {
      title: "Delete Cafe24 Customer Coupon",
      description: "Delete issued coupon(s) for a member by coupon number and optional issue no.",
      inputSchema: CustomerCouponDeleteParamsSchema,
    },
    cafe24_delete_customer_coupon,
  );
}
