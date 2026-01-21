import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  CommonEventSearchParamsSchema,
  CreateCommonEventSchema,
  DeleteCommonEventSchema,
  UpdateCommonEventSchema,
} from "../schemas/common-event.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type {
  CommonEventResponse,
  CommonEventsResponse,
  CreateCommonEventRequest,
  UpdateCommonEventRequest,
} from "../types/common-event.js";

async function cafe24_list_common_events(params: z.infer<typeof CommonEventSearchParamsSchema>) {
  const { shop_no, limit, offset } = params;
  try {
    const data = await makeApiRequest<CommonEventsResponse>(
      "/api/v2/admin/commonevents",
      "GET",
      undefined,
      { shop_no, limit, offset },
    );

    const content = data.commonevents
      .map(
        (event) =>
          `- [${event.event_no}] ${event.name} (Status: ${event.status}) - ${event.register_date}`,
      )
      .join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${data.commonevents.length} common events:\n${content}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
      isError: true,
    };
  }
}

async function cafe24_create_common_event(params: z.infer<typeof CreateCommonEventSchema>) {
  const { shop_no, request } = params;
  try {
    const payload: CreateCommonEventRequest = {
      shop_no,
      request,
    };

    const data = await makeApiRequest<CommonEventResponse>(
      "/api/v2/admin/commonevents",
      "POST",
      payload,
    );

    const event = data.commonevent;
    return {
      content: [
        {
          type: "text" as const,
          text: `Created common event: ${event.name} (ID: ${event.event_no})`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
      isError: true,
    };
  }
}

async function cafe24_update_common_event(params: z.infer<typeof UpdateCommonEventSchema>) {
  const { shop_no, event_no, request } = params;
  try {
    const payload: UpdateCommonEventRequest = {
      shop_no,
      request,
    };

    const data = await makeApiRequest<CommonEventResponse>(
      `/api/v2/admin/commonevents/${event_no}`,
      "PUT",
      payload,
    );

    const event = data.commonevent;
    return {
      content: [
        {
          type: "text" as const,
          text: `Updated common event: ${event.name} (ID: ${event.event_no})`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
      isError: true,
    };
  }
}

async function cafe24_delete_common_event(params: z.infer<typeof DeleteCommonEventSchema>) {
  const { shop_no, event_no } = params;
  try {
    const data = await makeApiRequest<CommonEventResponse>(
      `/api/v2/admin/commonevents/${event_no}`,
      "DELETE",
      undefined,
      { shop_no },
    );

    const event = data.commonevent;
    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted common event ID: ${event.event_no}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
      isError: true,
    };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_common_events",
    {
      title: "List Common Events",
      description: "List common events in Cafe24",
      inputSchema: CommonEventSearchParamsSchema,
    },
    cafe24_list_common_events,
  );

  server.registerTool(
    "cafe24_create_common_event",
    {
      title: "Create Common Event",
      description: "Create a new common event",
      inputSchema: CreateCommonEventSchema,
    },
    cafe24_create_common_event,
  );

  server.registerTool(
    "cafe24_update_common_event",
    {
      title: "Update Common Event",
      description: "Update an existing common event",
      inputSchema: UpdateCommonEventSchema,
    },
    cafe24_update_common_event,
  );

  server.registerTool(
    "cafe24_delete_common_event",
    {
      title: "Delete Common Event",
      description: "Delete a common event",
      inputSchema: DeleteCommonEventSchema,
    },
    cafe24_delete_common_event,
  );
}
