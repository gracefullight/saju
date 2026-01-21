import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type UrgentInquiryReplyCreateInput,
  UrgentInquiryReplyCreateSchema,
  type UrgentInquiryReplyParams,
  UrgentInquiryReplyParamsSchema,
  type UrgentInquiryReplyUpdateInput,
  UrgentInquiryReplyUpdateSchema,
  type UrgentInquirySearchParams,
  UrgentInquirySearchParamsSchema,
} from "../schemas/urgent-inquiry.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { UrgentInquiryReplyResponse, UrgentInquiryResponse } from "../types/index.js";

async function cafe24_list_urgent_inquiries(params: UrgentInquirySearchParams) {
  try {
    const data = await makeApiRequest<UrgentInquiryResponse>(
      "/admin/urgentinquiry",
      "GET",
      undefined,
      params,
    );

    const inquiries = data.urgentinquiry || [];
    if (inquiries.length === 0) {
      return {
        content: [{ type: "text" as const, text: "No urgent inquiries found." }],
      };
    }

    let markdown = "# Urgent Inquiries\n\n";
    markdown += `Found ${inquiries.length} urgent inquiries.\n\n`;

    for (const inquiry of inquiries) {
      markdown += `## [${inquiry.article_no}] ${inquiry.title}\n`;
      markdown += `- **Writer**: ${inquiry.writer} (${inquiry.member_id || "Guest"})\n`;
      markdown += `- **Date**: ${inquiry.start_date}\n`;
      markdown += `- **Reply Status**: ${inquiry.reply_status}\n`;
      markdown += `- **Type**: ${inquiry.article_type}\n`;
      markdown += `- **Content Preview**: ${inquiry.content.substring(0, 100)}${inquiry.content.length > 100 ? "..." : ""}\n\n`;
    }

    return {
      content: [{ type: "text" as const, text: markdown }],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_get_urgent_inquiry_reply(params: UrgentInquiryReplyParams) {
  try {
    const { article_no, shop_no } = params;
    const data = await makeApiRequest<UrgentInquiryReplyResponse>(
      `/admin/urgentinquiry/${article_no}/reply`,
      "GET",
      undefined,
      { shop_no },
    );

    const reply = data.reply;
    let markdown = `# Reply for Urgent Inquiry #${article_no}\n\n`;
    markdown += `- **Status**: ${reply.status}\n`;
    markdown += `- **Date**: ${reply.created_date}\n`;
    markdown += `- **User ID**: ${reply.user_id}\n`;
    markdown += `- **Method**: ${reply.method}\n`;
    markdown += `- **Content**: ${reply.content}\n`;

    if (reply.attached_file_detail && reply.attached_file_detail.length > 0) {
      markdown += "\n### Attached Files\n";
      for (const file of reply.attached_file_detail) {
        markdown += `- ${file.source} (${file.name})\n`;
      }
    }

    return {
      content: [{ type: "text" as const, text: markdown }],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_create_urgent_inquiry_reply(params: UrgentInquiryReplyCreateInput) {
  try {
    const { article_no, shop_no, request } = params;
    const data = await makeApiRequest<UrgentInquiryReplyResponse>(
      `/admin/urgentinquiry/${article_no}/reply`,
      "POST",
      { shop_no, request },
    );

    const reply = data.reply;
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created reply for urgent inquiry #${article_no}. Status: ${reply.status}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_update_urgent_inquiry_reply(params: UrgentInquiryReplyUpdateInput) {
  try {
    const { article_no, shop_no, request } = params;
    const data = await makeApiRequest<UrgentInquiryReplyResponse>(
      `/admin/urgentinquiry/${article_no}/reply`,
      "PUT",
      { shop_no, request },
    );

    const reply = data.reply;
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated reply for urgent inquiry #${article_no}. Status: ${reply.status}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export function registerUrgentInquiryTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_urgent_inquiries",
    {
      title: "List Urgent Inquiries",
      description: "Retrieve a list of urgent inquiries.",
      inputSchema: UrgentInquirySearchParamsSchema,
    },
    cafe24_list_urgent_inquiries,
  );

  server.registerTool(
    "cafe24_get_urgent_inquiry_reply",
    {
      title: "Get Urgent Inquiry Reply",
      description: "Retrieve the reply for a specific urgent inquiry.",
      inputSchema: UrgentInquiryReplyParamsSchema,
    },
    cafe24_get_urgent_inquiry_reply,
  );

  server.registerTool(
    "cafe24_create_urgent_inquiry_reply",
    {
      title: "Create Urgent Inquiry Reply",
      description: "Create a reply for a specific urgent inquiry.",
      inputSchema: UrgentInquiryReplyCreateSchema,
    },
    cafe24_create_urgent_inquiry_reply,
  );

  server.registerTool(
    "cafe24_update_urgent_inquiry_reply",
    {
      title: "Update Urgent Inquiry Reply",
      description: "Update the reply for a specific urgent inquiry.",
      inputSchema: UrgentInquiryReplyUpdateSchema,
    },
    cafe24_update_urgent_inquiry_reply,
  );
}
