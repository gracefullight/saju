import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import { ProductSeoGetParamsSchema, ProductSeoUpdateParamsSchema } from "@/schemas/product-seo.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

interface ProductSeo {
  shop_no: number;
  meta_title?: string;
  meta_author?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_alt?: string;
  search_engine_exposure?: string;
}

interface ProductSeoResponse {
  seo: ProductSeo;
}

async function cafe24_get_product_seo(params: z.infer<typeof ProductSeoGetParamsSchema>) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<ProductSeoResponse>(
      `/admin/products/${product_no}/seo`,
      "GET",
      undefined,
      undefined,
      requestHeaders,
    );

    const seo = data.seo;

    const content =
      `**Product SEO Settings for #${product_no}**\n\n` +
      `- **Browser Title**: ${seo.meta_title || "N/A"}\n` +
      `- **Meta Author**: ${seo.meta_author || "N/A"}\n` +
      `- **Meta Description**: ${seo.meta_description || "N/A"}\n` +
      `- **Meta Keywords**: ${seo.meta_keywords || "N/A"}\n` +
      `- **Image Alt Text**: ${seo.meta_alt || "N/A"}\n` +
      `- **Search Engine Exposure**: ${seo.search_engine_exposure === "T" ? "Enabled" : "Disabled"}`;

    return {
      content: [{ type: "text" as const, text: content }],
      structuredContent: { seo } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product_seo(params: z.infer<typeof ProductSeoUpdateParamsSchema>) {
  try {
    const { shop_no, product_no, ...seoData } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no: shop_no ?? 1,
      request: seoData,
    };

    const data = await makeApiRequest<ProductSeoResponse>(
      `/admin/products/${product_no}/seo`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    const seo = data.seo;

    const content =
      `**Updated SEO Settings for Product #${product_no}**\n\n` +
      `- **Browser Title**: ${seo.meta_title || "N/A"}\n` +
      `- **Meta Author**: ${seo.meta_author || "N/A"}\n` +
      `- **Meta Description**: ${seo.meta_description || "N/A"}\n` +
      `- **Meta Keywords**: ${seo.meta_keywords || "N/A"}\n` +
      `- **Image Alt Text**: ${seo.meta_alt || "N/A"}\n` +
      `- **Search Engine Exposure**: ${seo.search_engine_exposure === "T" ? "Enabled" : "Disabled"}`;

    return {
      content: [{ type: "text" as const, text: content }],
      structuredContent: { seo } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_product_seo",
    {
      title: "Get Product SEO Settings",
      description:
        "Retrieve SEO settings for a product including meta title, author, description, keywords, image alt text, and search engine exposure status.",
      inputSchema: ProductSeoGetParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product_seo,
  );

  server.registerTool(
    "cafe24_update_product_seo",
    {
      title: "Update Product SEO Settings",
      description:
        "Update SEO settings for a product. Configure meta title, author, description, keywords, image alt text, and search engine exposure.",
      inputSchema: ProductSeoUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product_seo,
  );
}
