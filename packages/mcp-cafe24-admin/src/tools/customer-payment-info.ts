import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type {
  CustomerPaymentInfoResponse,
  DeleteCustomerPaymentInfoResponse,
} from "@/types/index.js";
import {
  CustomerPaymentInfoParamsSchema,
  DeletePaymentMethodParamsSchema,
} from "../schemas/customer-payment-info.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_customer_payment_information(
  params: z.infer<typeof CustomerPaymentInfoParamsSchema>,
) {
  try {
    const { member_id, ...queryParams } = params;
    const data = await makeApiRequest<CustomerPaymentInfoResponse>(
      `/admin/customers/${member_id}/paymentinformation`,
      "GET",
      undefined,
      queryParams,
    );
    const payments = data.paymentinformation || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Payment Information for ${member_id}\n\n` +
            payments
              .map(
                (p) =>
                  `## ${p.payment_method.toUpperCase()} (${p.payment_gateway})\n` +
                  `- **Payment Method ID**: ${p.payment_method_id}\n` +
                  `- **Priority**: ${p.payment_proiority}\n` +
                  `- **Created Date**: ${p.created_date}\n`,
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

async function cafe24_delete_customer_payment_information(
  params: z.infer<typeof CustomerPaymentInfoParamsSchema>,
) {
  try {
    const { member_id, ...queryParams } = params;
    const data = await makeApiRequest<DeleteCustomerPaymentInfoResponse>(
      `/admin/customers/${member_id}/paymentinformation`,
      "DELETE",
      undefined,
      queryParams,
    );
    const info = data.paymentinformation;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted all payment information for member: ${info.member_id} (Shop #${info.shop_no})`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_customer_payment_method(
  params: z.infer<typeof DeletePaymentMethodParamsSchema>,
) {
  try {
    const { member_id, payment_method_id, ...queryParams } = params;
    const data = await makeApiRequest<DeleteCustomerPaymentInfoResponse>(
      `/admin/customers/${member_id}/paymentinformation/${payment_method_id}`,
      "DELETE",
      undefined,
      queryParams,
    );
    const info = data.paymentinformation;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted payment method ${info.payment_method_id} for member: ${info.member_id} (Shop #${info.shop_no})`,
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
    "cafe24_list_customer_payment_information",
    {
      title: "List Customer Payment Information",
      description: "Retrieve a list of registered payment methods for a specific customer.",
      inputSchema: CustomerPaymentInfoParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_customer_payment_information,
  );

  server.registerTool(
    "cafe24_delete_customer_payment_information",
    {
      title: "Delete All Customer Payment Information",
      description: "Delete all registered payment methods for a specific customer.",
      inputSchema: CustomerPaymentInfoParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_customer_payment_information,
  );

  server.registerTool(
    "cafe24_delete_customer_payment_method",
    {
      title: "Delete Specific Customer Payment Method",
      description:
        "Delete a specific registered payment method for a customer by payment method ID.",
      inputSchema: DeletePaymentMethodParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_customer_payment_method,
  );
}
