import { z } from "zod";

export const AdminMenusSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    mode: z
      .enum(["new_pro", "mobile_admin"])
      .default("new_pro")
      .describe("Menu mode (new_pro: PC admin, mobile_admin: Mobile admin)"),
    menu_no: z.string().optional().describe("Menu number(s), comma-separated for multiple"),
    contains_app_url: z
      .enum(["T", "F"])
      .optional()
      .describe("Filter by app URL inclusion (T: Included, F: Not included)"),
  })
  .strict();

export type AdminMenusSearchParams = z.infer<typeof AdminMenusSearchParamsSchema>;
