import { z } from "zod";

export const RedirectsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default:1)"),
    id: z.number().int().optional().describe("Redirect ID"),
    path: z.string().optional().describe("Redirect path"),
    target: z.string().optional().describe("Target location"),
  })
  .strict();

export const RedirectCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    path: z.string().describe("Redirect path (e.g., /cafe24)"),
    target: z.string().describe("Target URL (e.g., https://www.cafe24.com)"),
  })
  .strict();

export const RedirectUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    id: z.number().int().min(1).describe("Redirect ID"),
    path: z.string().optional().describe("New redirect path"),
    target: z.string().optional().describe("New target URL"),
  })
  .strict();

export const RedirectDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    id: z.number().int().min(1).describe("Redirect ID"),
  })
  .strict();

export type RedirectsSearchParams = z.infer<typeof RedirectsSearchParamsSchema>;
export type RedirectCreateParams = z.infer<typeof RedirectCreateParamsSchema>;
export type RedirectUpdateParams = z.infer<typeof RedirectUpdateParamsSchema>;
export type RedirectDeleteParams = z.infer<typeof RedirectDeleteParamsSchema>;
