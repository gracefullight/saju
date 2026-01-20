import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { Cancellation } from "@/types/index.js";
import {
  CancellationCreateParamsSchema,
  CancellationDetailParamsSchema,
  CancellationRequestCreateParamsSchema,
  CancellationRequestRejectParamsSchema,
  CancellationUpdateParamsSchema,
} from "../schemas/cancellation.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_get_cancellation(params: z.infer<typeof CancellationDetailParamsSchema>) {
  try {
    const data = await makeApiRequest<{ cancellation: Cancellation }>(
      `/admin/cancellation/${params.claim_code}`,
      "GET",
      undefined,
      { shop_no: params.shop_no },
    );
    const cancellation = data.cancellation || ({} as Cancellation);

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Cancellation Details (#${cancellation.claim_code})\n\n` +
            `- **Order ID**: ${cancellation.order_id}\n` +
            `- **Reason**: ${cancellation.claim_reason} (${cancellation.claim_reason_type})\n` +
            `- **Refund Methods**: ${cancellation.refund_methods?.join(", ") || "N/A"}\n` +
            `- **Amount**: ${cancellation.order_price_amount}\n` +
            `- **Undone**: ${cancellation.undone === "T" ? "Yes" : "No"}\n` +
            `- **Items**: ${cancellation.items?.length || 0} product(s)\n`,
        },
      ],
      structuredContent: {
        cancellation,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_cancellation(params: z.infer<typeof CancellationCreateParamsSchema>) {
  try {
    const data = await makeApiRequest<{ cancellation: any[] }>("/admin/cancellation", "POST", {
      shop_no: params.shop_no,
      requests: params.requests,
    });
    const cancellations = data.cancellation || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created ${cancellations.length} cancellation(s).`,
        },
      ],
      structuredContent: {
        results: cancellations,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_cancellation(params: z.infer<typeof CancellationUpdateParamsSchema>) {
  try {
    const data = await makeApiRequest<{ cancellation: any[] }>("/admin/cancellation", "PUT", {
      shop_no: params.shop_no,
      requests: params.requests,
    });
    const cancellations = data.cancellation || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated ${cancellations.length} cancellation(s).`,
        },
      ],
      structuredContent: {
        results: cancellations,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_cancellation_request(
  params: z.infer<typeof CancellationRequestCreateParamsSchema>,
) {
  try {
    const data = await makeApiRequest<{ cancellationrequests: any[] }>(
      "/admin/cancellationrequests",
      "POST",
      {
        shop_no: params.shop_no,
        requests: params.requests,
      },
    );
    const requests = data.cancellationrequests || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created ${requests.length} cancellation request(s).`,
        },
      ],
      structuredContent: {
        results: requests,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_reject_cancellation_request(
  params: z.infer<typeof CancellationRequestRejectParamsSchema>,
) {
  try {
    const data = await makeApiRequest<{ cancellationrequests: any[] }>(
      "/admin/cancellationrequests",
      "PUT",
      {
        shop_no: params.shop_no,
        requests: params.requests,
      },
    );
    const requests = data.cancellationrequests || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully rejected ${requests.length} cancellation request(s).`,
        },
      ],
      structuredContent: {
        results: requests,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_cancellation",
    {
      title: "Get Cafe24 Cancellation Details",
      description:
        "Retrieve detailed information about a specific cancellation by its claim code. Includes order ID, reason, refund methods, amount, status, and items.",
      inputSchema: CancellationDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_cancellation,
  );

  server.registerTool(
    "cafe24_create_cancellation",
    {
      title: "Create Cafe24 Cancellation",
      description:
        "Create one or more order cancellations in Cafe24. Can specify order ID, items, status (canceled/canceling), reason, and refund information.",
      inputSchema: CancellationCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_cancellation,
  );

  server.registerTool(
    "cafe24_update_cancellation",
    {
      title: "Update Cafe24 Cancellation (Undo)",
      description:
        "Update or undo existing cancellations in Cafe24. Used to recover inventory and undo cancellation requests.",
      inputSchema: CancellationUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_update_cancellation,
  );

  server.registerTool(
    "cafe24_create_cancellation_request",
    {
      title: "Create Cafe24 Cancellation Request",
      description:
        "Create one or more cancellation requests in Cafe24. Typically used when a customer requests a cancellation that requires admin approval.",
      inputSchema: CancellationRequestCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_cancellation_request,
  );

  server.registerTool(
    "cafe24_reject_cancellation_request",
    {
      title: "Reject/Undone Cafe24 Cancellation Request",
      description:
        "Reject or undo a customer's cancellation request in Cafe24. Can specify a reason for rejection to be displayed in the storefront.",
      inputSchema: CancellationRequestRejectParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_reject_cancellation_request,
  );
}
