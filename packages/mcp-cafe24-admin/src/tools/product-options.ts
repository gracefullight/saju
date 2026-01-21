import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  ProductOptionsCreateParamsSchema,
  ProductOptionsDeleteParamsSchema,
  ProductOptionsGetParamsSchema,
  ProductOptionsUpdateParamsSchema,
} from "../schemas/product-options.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

interface OptionValue {
  option_image_file?: string;
  option_link_image?: string;
  option_color?: string;
  option_text: string;
  value_no?: number | null;
  additional_amount?: string | null;
}

interface Option {
  option_code?: string;
  option_name: string;
  option_value: OptionValue[];
  required_option?: string;
  option_display_type?: string;
}

interface AdditionalOption {
  additional_option_name: string;
  required_additional_option: string;
  additional_option_text_length: number;
}

interface AttachedFileOption {
  option_name: string;
  required: string;
  size_limit: number;
}

interface ProductOption {
  shop_no: number;
  product_no: number;
  has_option: string;
  option_type?: string;
  option_list_type?: string;
  option_preset_code?: string;
  options?: Option[];
  select_one_by_option?: string;
  option_preset_name?: string;
  use_additional_option?: string;
  additional_options?: AdditionalOption[];
  use_attached_file_option?: string;
  attached_file_option?: AttachedFileOption;
}

interface ProductOptionResponse {
  option: ProductOption;
}

interface ProductOptionDeleteResponse {
  option: { product_no: number };
}

async function cafe24_get_product_options(params: z.infer<typeof ProductOptionsGetParamsSchema>) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<ProductOptionResponse>(
      `/admin/products/${product_no}/options`,
      "GET",
      undefined,
      undefined,
      requestHeaders,
    );

    const option = data.option;

    return {
      content: [
        {
          type: "text" as const,
          text: formatProductOptions(option),
        },
      ],
      structuredContent: { option } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

function formatProductOptions(option: ProductOption): string {
  let content = `**Product Options for #${option.product_no}**\n`;
  content += `- Has Option: ${option.has_option === "T" ? "Yes" : "No"}\n`;

  if (option.has_option === "T") {
    content += `- Option Type: ${getOptionTypeLabel(option.option_type)}\n`;
    content += `- Option List Type: ${option.option_list_type === "C" ? "Integrated" : "Separated"}\n`;

    content += formatOptionList(option.options);
    content += formatAdditionalOptions(option);
    content += formatAttachedFileOption(option);
  }

  return content;
}

function formatOptionList(optionsList?: Option[]): string {
  if (!optionsList || optionsList.length === 0) return "";

  let content = `\n**Options (${optionsList.length}):**\n`;
  for (const opt of optionsList) {
    content += `\n### ${opt.option_name}\n`;
    content += `- Code: ${opt.option_code || "N/A"}\n`;
    content += `- Required: ${opt.required_option === "T" ? "Yes" : "No"}\n`;
    content += `- Display Type: ${getDisplayTypeLabel(opt.option_display_type)}\n`;
    content += `- Values: ${opt.option_value.map((v) => v.option_text).join(", ")}\n`;
  }
  return content;
}

function formatAdditionalOptions(option: ProductOption): string {
  if (option.use_additional_option !== "T" || !option.additional_options) return "";

  let content = `\n**Additional Options (${option.additional_options.length}):**\n`;
  for (const addOpt of option.additional_options) {
    content += `- ${addOpt.additional_option_name} (Required: ${addOpt.required_additional_option === "T" ? "Yes" : "No"}, Max Length: ${addOpt.additional_option_text_length})\n`;
  }
  return content;
}

function formatAttachedFileOption(option: ProductOption): string {
  if (option.use_attached_file_option !== "T" || !option.attached_file_option) return "";

  let content = `\n**Attached File Option:**\n`;
  content += `- Name: ${option.attached_file_option.option_name}\n`;
  content += `- Required: ${option.attached_file_option.required === "T" ? "Yes" : "No"}\n`;
  content += `- Size Limit: ${option.attached_file_option.size_limit}MB\n`;
  return content;
}

async function cafe24_create_product_options(
  params: z.infer<typeof ProductOptionsCreateParamsSchema>,
) {
  try {
    const { shop_no, product_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no: shop_no ?? 1,
      request: requestBody,
    };

    const data = await makeApiRequest<ProductOptionResponse>(
      `/admin/products/${product_no}/options`,
      "POST",
      payload,
      undefined,
      requestHeaders,
    );

    const option = data.option;
    const optionsCount = option.options?.length || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Created options for product #${option.product_no}\n` +
            `- Has Option: ${option.has_option === "T" ? "Yes" : "No"}\n` +
            `- Option Type: ${getOptionTypeLabel(option.option_type)}\n` +
            `- Options Count: ${optionsCount}`,
        },
      ],
      structuredContent: { option } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product_options(
  params: z.infer<typeof ProductOptionsUpdateParamsSchema>,
) {
  try {
    const { shop_no, product_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no: shop_no ?? 1,
      request: requestBody,
    };

    const data = await makeApiRequest<ProductOptionResponse>(
      `/admin/products/${product_no}/options`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    const option = data.option;
    const optionsCount = option.options?.length || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Updated options for product #${option.product_no}\n` +
            `- Has Option: ${option.has_option === "T" ? "Yes" : "No"}\n` +
            `- Option Type: ${getOptionTypeLabel(option.option_type)}\n` +
            `- Options Count: ${optionsCount}`,
        },
      ],
      structuredContent: { option } as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_product_options(
  params: z.infer<typeof ProductOptionsDeleteParamsSchema>,
) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<ProductOptionDeleteResponse>(
      `/admin/products/${product_no}/options`,
      "DELETE",
      undefined,
      undefined,
      requestHeaders,
    );

    const deletedProductNo = data.option?.product_no || product_no;

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted all options from product #${deletedProductNo}`,
        },
      ],
      structuredContent: { option: { product_no: deletedProductNo } } as unknown as Record<
        string,
        unknown
      >,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

function getOptionTypeLabel(type?: string): string {
  switch (type) {
    case "T":
      return "Combination";
    case "E":
      return "Linked with product";
    case "F":
      return "Independently selectable";
    default:
      return type || "N/A";
  }
}

function getDisplayTypeLabel(type?: string): string {
  switch (type) {
    case "S":
      return "Select box";
    case "P":
      return "Preview";
    case "B":
      return "Text swatch";
    case "R":
      return "Radio button";
    default:
      return type || "N/A";
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_product_options",
    {
      title: "Get Product Options",
      description:
        "Retrieve options configuration for a product including option types, values, additional options, and attached file options.",
      inputSchema: ProductOptionsGetParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product_options,
  );

  server.registerTool(
    "cafe24_create_product_options",
    {
      title: "Create Product Options",
      description:
        "Create options for a product. Supports combination, linked, and independently selectable option types. Can include additional options and attached file options.",
      inputSchema: ProductOptionsCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_product_options,
  );

  server.registerTool(
    "cafe24_update_product_options",
    {
      title: "Update Product Options",
      description:
        "Update existing options for a product. Use original_options to specify the current option values before modification.",
      inputSchema: ProductOptionsUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product_options,
  );

  server.registerTool(
    "cafe24_delete_product_options",
    {
      title: "Delete Product Options",
      description: "Delete all options from a product.",
      inputSchema: ProductOptionsDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_product_options,
  );
}
