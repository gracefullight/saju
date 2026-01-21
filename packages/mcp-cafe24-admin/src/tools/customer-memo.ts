import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  CountCustomerMemosParamsSchema,
  CreateCustomerMemoParamsSchema,
  DeleteCustomerMemoParamsSchema,
  ListCustomerMemosParamsSchema,
  RetrieveCustomerMemoParamsSchema,
  UpdateCustomerMemoParamsSchema,
} from "@/schemas/customer-memo.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  CountCustomerMemosParams,
  CreateCustomerMemoParams,
  CustomerMemoResponse,
  CustomerMemosCountResponse,
  CustomerMemosResponse,
  DeleteCustomerMemoParams,
  ListCustomerMemosParams,
  RetrieveCustomerMemoParams,
  UpdateCustomerMemoParams,
} from "@/types/index.js";

async function cafe24_list_customer_memos(params: ListCustomerMemosParams) {
  try {
    const { member_id, ...queryParams } = params;
    const data = await makeApiRequest<CustomerMemosResponse>(
      `/admin/customers/${member_id}/memos`,
      "GET",
      undefined,
      queryParams,
    );
    const memos = data.memos || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Memos for Customer: ${member_id}\n\n` +
            (memos.length > 0
              ? memos
                  .map(
                    (m) =>
                      `## Memo #${m.memo_no} ${m.important_flag === "T" ? "⭐" : ""}\n` +
                      `- **Author**: ${m.author_id}\n` +
                      `- **Date**: ${m.created_date}\n` +
                      `- **Content**: ${m.memo}\n`,
                  )
                  .join("\n")
              : "No memos found."),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_customer_memos(params: CountCustomerMemosParams) {
  try {
    const { member_id, ...queryParams } = params;
    const data = await makeApiRequest<CustomerMemosCountResponse>(
      `/admin/customers/${member_id}/memos/count`,
      "GET",
      undefined,
      queryParams,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Customer ${member_id} has ${data.count} memo(s).`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_retrieve_customer_memo(params: RetrieveCustomerMemoParams) {
  try {
    const { member_id, memo_no, ...queryParams } = params;
    const data = await makeApiRequest<CustomerMemoResponse>(
      `/admin/customers/${member_id}/memos/${memo_no}`,
      "GET",
      undefined,
      queryParams,
    );
    const m = data.memo;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Customer Memo Details\n\n` +
            `- **Memo No**: ${m.memo_no} ${m.important_flag === "T" ? "⭐" : ""}\n` +
            `- **Member ID**: ${member_id}\n` +
            `- **Author**: ${m.author_id}\n` +
            `- **Date**: ${m.created_date}\n` +
            `- **Content**: ${m.memo}\n`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_customer_memo(params: CreateCustomerMemoParams) {
  try {
    const { member_id, ...requestBody } = params;
    const data = await makeApiRequest<CustomerMemoResponse>(
      `/admin/customers/${member_id}/memos`,
      "POST",
      requestBody,
    );
    const m = data.memo;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created memo #${m.memo_no} for customer ${member_id}.`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_customer_memo(params: UpdateCustomerMemoParams) {
  try {
    const { member_id, memo_no, ...requestBody } = params;
    const data = await makeApiRequest<CustomerMemoResponse>(
      `/admin/customers/${member_id}/memos/${memo_no}`,
      "PUT",
      requestBody,
    );
    const m = data.memo;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated memo #${m.memo_no} for customer ${member_id}.`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_customer_memo(params: DeleteCustomerMemoParams) {
  try {
    const { member_id, memo_no, ...queryParams } = params;
    const data = await makeApiRequest<CustomerMemoResponse>(
      `/admin/customers/${member_id}/memos/${memo_no}`,
      "DELETE",
      undefined,
      queryParams,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted memo #${memo_no} for customer ${member_id}.`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerCustomerMemoTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_customer_memos",
    {
      title: "List Cafe24 Customer Memos",
      description: "Retrieve a list of memos for a specific customer.",
      inputSchema: ListCustomerMemosParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_customer_memos,
  );

  server.registerTool(
    "cafe24_count_customer_memos",
    {
      title: "Count Cafe24 Customer Memos",
      description: "Retrieve the total number of memos for a specific customer.",
      inputSchema: CountCustomerMemosParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_customer_memos,
  );

  server.registerTool(
    "cafe24_retrieve_customer_memo",
    {
      title: "Retrieve Cafe24 Customer Memo",
      description: "Retrieve details of a single customer memo by memo number.",
      inputSchema: RetrieveCustomerMemoParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_retrieve_customer_memo,
  );

  server.registerTool(
    "cafe24_create_customer_memo",
    {
      title: "Create Cafe24 Customer Memo",
      description: "Add a new memo for a customer.",
      inputSchema: CreateCustomerMemoParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_customer_memo,
  );

  server.registerTool(
    "cafe24_update_customer_memo",
    {
      title: "Update Cafe24 Customer Memo",
      description: "Update an existing customer memo.",
      inputSchema: UpdateCustomerMemoParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_customer_memo,
  );

  server.registerTool(
    "cafe24_delete_customer_memo",
    {
      title: "Delete Cafe24 Customer Memo",
      description: "Delete a customer memo.",
      inputSchema: DeleteCustomerMemoParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_customer_memo,
  );
}
