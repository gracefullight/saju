import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  CustomerGroupParamsSchema,
  CustomerGroupsCountParamsSchema,
  CustomerGroupsSearchParamsSchema,
  MoveCustomerToGroupParamsSchema,
} from "@/schemas/customer-group.js";
import type {
  CustomerGroup,
  CustomerGroupParams,
  CustomerGroupsCountParams,
  CustomerGroupsSearchParams,
  MoveCustomerToGroupParams,
} from "@/types/index.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_customer_groups(params: CustomerGroupsSearchParams) {
  try {
    const data = await makeApiRequest("/admin/customergroups", "GET", undefined, params);
    const responseData = data as
      | { customergroups?: Record<string, unknown>[] }
      | Record<string, unknown>;
    const customergroups = (responseData.customergroups || []) as CustomerGroup[];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${customergroups.length} customer groups\n\n` +
            customergroups
              .map(
                (g) =>
                  `## [${g.group_no}] ${g.group_name}\n` +
                  `- **Description**: ${g.group_description || "N/A"}\n` +
                  `- **Buy Benefits**: ${g.buy_benefits}\n` +
                  `- **Ship Benefits**: ${g.ship_benefits === "T" ? "Free" : "Paid"}\n` +
                  `- **Pay Method**: ${g.benefits_paymethod === "A" ? "All" : g.benefits_paymethod === "B" ? "Cash" : "Non-cash"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: customergroups.length,
        customergroups,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_customer_groups(params: CustomerGroupsCountParams) {
  try {
    const data = await makeApiRequest<{ count: number }>(
      "/admin/customergroups/count",
      "GET",
      undefined,
      params,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Total customer group count: ${data.count}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_retrieve_customer_group(params: CustomerGroupParams) {
  try {
    const { group_no, ...queryParams } = params;
    const data = await makeApiRequest<{ customergroup: CustomerGroup }>(
      `/admin/customergroups/${group_no}`,
      "GET",
      undefined,
      queryParams,
    );
    const g = data.customergroup;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Customer Group: ${g.group_name} (${g.group_no})\n\n` +
            `- **Description**: ${g.group_description || "N/A"}\n` +
            `- **Buy Benefits**: ${g.buy_benefits}\n` +
            `- **Ship Benefits**: ${g.ship_benefits === "T" ? "Free" : "Paid"}\n` +
            `- **Pay Method**: ${g.benefits_paymethod === "A" ? "All" : g.benefits_paymethod === "B" ? "Cash" : "Non-cash"}\n` +
            `- **Product Availability**: ${g.product_availability}\n` +
            (g.discount_information
              ? `\n### Discount Information\n- **Amount Product**: ${g.discount_information.amount_product}\n- **Amount Discount**: ${g.discount_information.amount_discount} (${g.discount_information.discount_unit})\n`
              : "") +
            (g.points_information
              ? `\n### Points Information\n- **Amount Product**: ${g.points_information.amount_product}\n- **Amount Discount**: ${g.points_information.amount_discount} (${g.points_information.discount_unit})\n`
              : ""),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_move_customers_to_group(params: MoveCustomerToGroupParams) {
  try {
    const { group_no, ...requestBody } = params;
    const data = await makeApiRequest<{
      customers: Array<{
        shop_no: number;
        group_no: number;
        member_id: string;
        fixed_group: string;
      }>;
    }>(`/admin/customergroups/${group_no}/customers`, "POST", requestBody);

    const customers = data.customers || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully moved ${customers.length} customers to group #${group_no}.`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerCustomerGroupTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_customer_groups",
    {
      title: "List Cafe24 Customer Groups",
      description:
        "Retrieve a list of customer groups from the mall. Supports filtering by group_no or group_name.",
      inputSchema: CustomerGroupsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_customer_groups,
  );

  server.registerTool(
    "cafe24_count_customer_groups",
    {
      title: "Count Cafe24 Customer Groups",
      description:
        "Retrieve the number of customer groups. Supports filtering by group_no or group_name.",
      inputSchema: CustomerGroupsCountParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_customer_groups,
  );

  server.registerTool(
    "cafe24_retrieve_customer_group",
    {
      title: "Retrieve Cafe24 Customer Group",
      description: "Retrieve details of a single customer group by group_no.",
      inputSchema: CustomerGroupParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_retrieve_customer_group,
  );

  server.registerTool(
    "cafe24_move_customers_to_group",
    {
      title: "Move Cafe24 Customers to Group",
      description: "Move one or more customers to a specific customer group (tier).",
      inputSchema: MoveCustomerToGroupParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_move_customers_to_group,
  );
}
