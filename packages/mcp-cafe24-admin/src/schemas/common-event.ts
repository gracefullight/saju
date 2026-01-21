import { z } from "zod";

export const CommonEventSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
  })
  .strict();

export const CreateCommonEventSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    request: z.object({
      name: z.string().max(255).describe("Event name"),
      status: z.enum(["T", "F"]).default("T").describe("Campaign status"),
      category_no: z.number().min(0).default(0).describe("Product category number (0 for all)"),
      display_position: z
        .enum(["top_detail", "side_image"])
        .default("top_detail")
        .describe("Show promotion on"),
      content: z.string().describe("Content"),
    }),
  })
  .strict();

export const UpdateCommonEventSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    event_no: z.number().int().min(1).describe("Event number"),
    request: z.object({
      name: z.string().max(255).optional().describe("Event name"),
      status: z.enum(["T", "F"]).optional().describe("Campaign status"),
      category_no: z.number().min(0).optional().describe("Product category number"),
      display_position: z
        .enum(["top_detail", "side_image"])
        .optional()
        .describe("Show promotion on"),
      content: z.string().optional().describe("Content"),
    }),
  })
  .strict();

export const DeleteCommonEventSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    event_no: z.number().int().min(1).describe("Event number"),
  })
  .strict();
