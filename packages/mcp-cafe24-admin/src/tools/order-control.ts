import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { PaymentControl } from "@/types/index.js";
import { PaymentControlUpdateParamsSchema } from "../schemas/order-control.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_update_payment_control(
  params: z.infer<typeof PaymentControlUpdateParamsSchema>,
) {
  try {
    const data = await makeApiRequest<{ control: PaymentControl }>("/admin/control", "PUT", {
      request: params.request,
    });
    const control = data.control;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated payment control. Restrictions: ${control.payments_control === "T" ? "Enabled" : "Disabled"}. Redirect: ${control.direct_url}`,
        },
      ],
      structuredContent: {
        control,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_update_payment_control",
    {
      title: "Update Cafe24 Payment Control",
      description:
        "Restrict manual payment confirmation and set a redirect URL for payment-related actions in Cafe24.",
      inputSchema: PaymentControlUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_payment_control,
  );
}
