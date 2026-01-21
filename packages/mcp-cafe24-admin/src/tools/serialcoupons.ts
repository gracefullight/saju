import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type SerialCouponCreateParams,
  SerialCouponCreateParamsSchema,
  type SerialCouponDeleteParams,
  SerialCouponDeleteParamsSchema,
  type SerialCouponsSearchParams,
  SerialCouponsSearchParamsSchema,
} from "@/schemas/serialcoupons.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  SerialCouponCreateRequest,
  SerialCouponDeleteResponse,
  SerialCouponsCreateResponse,
  SerialCouponsListResponse,
} from "@/types/index.js";

async function cafe24_list_serial_coupons(params: SerialCouponsSearchParams) {
  try {
    const { shop_no, ...queryParams } = params;
    const data = await makeApiRequest<SerialCouponsListResponse>(
      "/admin/serialcoupons",
      "GET",
      undefined,
      {
        shop_no: shop_no || 1,
        ...queryParams,
      },
    );

    const serialcoupons = data.serialcoupons || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Serial Coupons (${serialcoupons.length})\n\n` +
            (serialcoupons.length > 0
              ? serialcoupons
                  .map(
                    (coupon) =>
                      `## ${coupon.coupon_name} (${coupon.serial_no ?? "N/A"})\n` +
                      `- **Coupon No**: ${coupon.coupon_no}\n` +
                      `- **Benefit**: ${coupon.benefit_text ?? coupon.benefit_type ?? "N/A"}\n` +
                      `- **Available**: ${coupon.available_begin_datetime ?? "N/A"} ~ ${coupon.available_end_datetime ?? "N/A"}\n` +
                      `- **Deleted**: ${coupon.deleted ?? "N/A"}\n`,
                  )
                  .join("\n")
              : "No serial coupons found."),
        },
      ],
      structuredContent: {
        serialcoupons,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_serial_coupon(params: SerialCouponCreateParams) {
  try {
    const { shop_no, request } = params;
    const requestBody: SerialCouponCreateRequest = {
      shop_no: shop_no || 1,
      request,
    };

    const data = await makeApiRequest<SerialCouponsCreateResponse>(
      "/admin/serialcoupons",
      "POST",
      requestBody,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Serial coupon created: ${data.serialcoupons.coupon_name} (No: ${data.serialcoupons.coupon_no})`,
        },
      ],
      structuredContent: {
        serialcoupon: data.serialcoupons,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_serial_coupon(params: SerialCouponDeleteParams) {
  try {
    const { shop_no, coupon_no } = params;
    const data = await makeApiRequest<SerialCouponDeleteResponse>(
      `/admin/serialcoupons/${coupon_no}`,
      "DELETE",
      undefined,
      { shop_no: shop_no || 1 },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Serial coupon deleted: ${data.serialcoupon.coupon_no}`,
        },
      ],
      structuredContent: {
        serialcoupon: data.serialcoupon,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_serial_coupons",
    {
      title: "List Cafe24 Serial Coupons",
      description: "Retrieve a list of serial coupons.",
      inputSchema: SerialCouponsSearchParamsSchema,
    },
    cafe24_list_serial_coupons,
  );

  server.registerTool(
    "cafe24_create_serial_coupon",
    {
      title: "Create Cafe24 Serial Coupon",
      description: "Create a new serial coupon.",
      inputSchema: SerialCouponCreateParamsSchema,
    },
    cafe24_create_serial_coupon,
  );

  server.registerTool(
    "cafe24_delete_serial_coupon",
    {
      title: "Delete Cafe24 Serial Coupon",
      description: "Delete a serial coupon by coupon number.",
      inputSchema: SerialCouponDeleteParamsSchema,
    },
    cafe24_delete_serial_coupon,
  );
}
