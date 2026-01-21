import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  DecorationImagesCreateUpdateParamsSchema,
  DecorationImagesDeleteParamsSchema,
  DecorationImagesGetParamsSchema,
  ProductAdditionalImagesDeleteParamsSchema,
  ProductAdditionalImagesParamsSchema,
} from "@/schemas/product.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";

async function cafe24_create_product_additional_images(
  params: z.infer<typeof ProductAdditionalImagesParamsSchema>,
) {
  try {
    const { shop_no, product_no, additional_image } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: {
        additional_image,
      },
    };

    const data = await makeApiRequest<{
      additionalimage: { shop_no: number; additional_image: Record<string, string>[] };
    }>(
      `/admin/products/${product_no}/additionalimages`,
      "POST",
      payload,
      undefined,
      requestHeaders,
    );

    const result =
      data.additionalimage || ({ additional_image: [] } as { additional_image?: string[] });

    return {
      content: [
        {
          type: "text" as const,
          text: `Added ${result.additional_image?.length || 0} additional images to product ${product_no}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product_additional_images(
  params: z.infer<typeof ProductAdditionalImagesParamsSchema>,
) {
  try {
    const { shop_no, product_no, additional_image } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: {
        additional_image,
      },
    };

    const data = await makeApiRequest<{
      additionalimage: { shop_no: number; additional_image: Record<string, string>[] };
    }>(`/admin/products/${product_no}/additionalimages`, "PUT", payload, undefined, requestHeaders);

    const result = data.additionalimage || ({} as { additional_image?: string[] });

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated additional images for product ${product_no} (${result.additional_image?.length || 0} images)`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_product_additional_images(
  params: z.infer<typeof ProductAdditionalImagesDeleteParamsSchema>,
) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{
      additionalimage: { shop_no: number; product_no: number };
    }>(
      `/admin/products/${product_no}/additionalimages`,
      "DELETE",
      undefined,
      { shop_no },
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted all additional images from product ${data.additionalimage?.product_no || product_no}`,
        },
      ],
      structuredContent: data.additionalimage as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_decoration_images(
  params: z.infer<typeof DecorationImagesGetParamsSchema>,
) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{
      decorationimage: {
        use_show_date: string;
        show_start_date: string;
        show_end_date: string;
        image_list: Record<string, string>[];
      };
    }>(
      `/admin/products/${product_no}/decorationimages`,
      "GET",
      undefined,
      { shop_no },
      requestHeaders,
    );

    const result =
      data.decorationimage ||
      ({} as {
        show_start_date?: string;
        show_end_date: string;
        image_list: Record<string, string>[];
        use_show_date?: string;
      });
    const images = result.image_list || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Decoration images for product ${product_no}\n` +
            `Show date: ${result.use_show_date === "T" ? "Enabled" : "Disabled"}\n` +
            `Period: ${result.show_start_date || "N/A"} ~ ${result.show_end_date || "N/A"}\n\n` +
            images
              .map(
                (img) =>
                  `- Code: ${img.code}, Position: ${img.image_horizontal_position}/${img.image_vertical_position}`,
              )
              .join("\n"),
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_decoration_images(
  params: z.infer<typeof DecorationImagesCreateUpdateParamsSchema>,
) {
  try {
    const { shop_no, product_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest<{
      decorationimage: Record<string, unknown>;
    }>(
      `/admin/products/${product_no}/decorationimages`,
      "POST",
      payload,
      undefined,
      requestHeaders,
    );

    const result = data.decorationimage || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Created decoration images for product ${product_no}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_decoration_images(
  params: z.infer<typeof DecorationImagesCreateUpdateParamsSchema>,
) {
  try {
    const { shop_no, product_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest<{
      decorationimage: Record<string, unknown>;
    }>(`/admin/products/${product_no}/decorationimages`, "PUT", payload, undefined, requestHeaders);

    const result = data.decorationimage || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated decoration images for product ${product_no}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_decoration_image(
  params: z.infer<typeof DecorationImagesDeleteParamsSchema>,
) {
  try {
    const { shop_no, product_no, code } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{
      decorationimage: { shop_no: number; code: string };
    }>(
      `/admin/products/${product_no}/decorationimages/${code}`,
      "DELETE",
      undefined,
      { shop_no },
      requestHeaders,
    );

    const result = data.decorationimage || ({} as { code?: string });

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted decoration image ${result.code || code} from product ${product_no}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_create_product_additional_images",
    {
      title: "Create Product Additional Images",
      description:
        "Add additional images to a product. Max 20 images, 5MB each, 30MB total per request. Images should be base64 data URIs.",
      inputSchema: ProductAdditionalImagesParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_product_additional_images,
  );

  server.registerTool(
    "cafe24_update_product_additional_images",
    {
      title: "Update Product Additional Images",
      description:
        "Replace all additional images for a product. Max 20 images, 5MB each, 30MB total per request. Images should be base64 data URIs.",
      inputSchema: ProductAdditionalImagesParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product_additional_images,
  );

  server.registerTool(
    "cafe24_delete_product_additional_images",
    {
      title: "Delete Product Additional Images",
      description: "Delete all additional images from a product.",
      inputSchema: ProductAdditionalImagesDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_product_additional_images,
  );

  server.registerTool(
    "cafe24_get_decoration_images",
    {
      title: "Get Product Decoration Images",
      description: "Retrieve decoration images of a product.",
      inputSchema: DecorationImagesGetParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_decoration_images,
  );

  server.registerTool(
    "cafe24_create_decoration_images",
    {
      title: "Create Product Decoration Images",
      description: "Add decoration images to a product with position settings.",
      inputSchema: DecorationImagesCreateUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_decoration_images,
  );

  server.registerTool(
    "cafe24_update_decoration_images",
    {
      title: "Update Product Decoration Images",
      description: "Update decoration images for a product.",
      inputSchema: DecorationImagesCreateUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_decoration_images,
  );

  server.registerTool(
    "cafe24_delete_decoration_image",
    {
      title: "Delete Product Decoration Image",
      description: "Delete a specific decoration image from a product.",
      inputSchema: DecorationImagesDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_decoration_image,
  );
}
