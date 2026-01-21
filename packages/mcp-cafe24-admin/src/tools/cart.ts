import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CartSettingParams,
  CartSettingParamsSchema,
  type CartSettingUpdateParams,
  CartSettingUpdateParamsSchema,
} from "@/schemas/cart.js";
import type { CartSetting } from "@/types/index.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

async function cafe24_get_cart_setting(params: CartSettingParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/carts/setting", "GET", undefined, queryParams);
    const responseData = data as { cart?: Record<string, unknown> } | Record<string, unknown>;
    const cart = (responseData.cart || responseData) as CartSetting;

    const actionTypeMap: Record<string, string> = {
      M: "Go to cart page",
      S: "Show selection popup",
    };

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Cart Settings (Shop #${cart.shop_no || 1})\n\n` +
            `- **Wishlist Display**: ${cart.wishlist_display === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Add Action Type**: ${actionTypeMap[cart.add_action_type || ""] || cart.add_action_type}\n` +
            `- **Direct Purchase**: ${cart.cart_item_direct_purchase === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Storage Period**: ${cart.storage_period === "T" ? `${cart.period} days` : "Not set"}\n` +
            `- **Icon Display**: ${cart.icon_display === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Option Change**: ${cart.cart_item_option_change === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Discount Display**: ${cart.discount_display === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: cart.shop_no ?? 1,
        wishlist_display: cart.wishlist_display,
        add_action_type: cart.add_action_type,
        cart_item_direct_purchase: cart.cart_item_direct_purchase,
        storage_period: cart.storage_period,
        period: cart.period,
        icon_display: cart.icon_display,
        cart_item_option_change: cart.cart_item_option_change,
        discount_display: cart.discount_display,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_cart_setting(params: CartSettingUpdateParams) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/carts/setting", "PUT", requestBody);
    const responseData = data as { cart?: Record<string, unknown> } | Record<string, unknown>;
    const cart = (responseData.cart || responseData) as CartSetting;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Cart Settings Updated (Shop #${cart.shop_no || 1})\n\n` +
            `- **Wishlist Display**: ${cart.wishlist_display === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Storage Period**: ${cart.storage_period === "T" ? `${cart.period} days` : "Not set"}\n` +
            `- **Discount Display**: ${cart.discount_display === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: cart.shop_no ?? 1,
        wishlist_display: cart.wishlist_display,
        add_action_type: cart.add_action_type,
        cart_item_direct_purchase: cart.cart_item_direct_purchase,
        storage_period: cart.storage_period,
        period: cart.period,
        icon_display: cart.icon_display,
        cart_item_option_change: cart.cart_item_option_change,
        discount_display: cart.discount_display,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_cart_setting",
    {
      title: "Get Cafe24 Cart Settings",
      description:
        "Retrieve cart settings including wishlist display, add action type, direct purchase, storage period, icon display, option change, and discount display.",
      inputSchema: CartSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_cart_setting,
  );

  server.registerTool(
    "cafe24_update_cart_setting",
    {
      title: "Update Cafe24 Cart Settings",
      description:
        "Update cart settings including wishlist display, add action type (M=go to cart, S=selection popup), direct purchase, storage period (1-10, 14, or 30 days), icon display, option change, and discount display.",
      inputSchema: CartSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_cart_setting,
  );
}
