import { z } from "zod";

export const RestockNotificationParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const RestockNotificationUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use: z.enum(["T", "F"]).optional().describe("Use restock notification: T=Yes, F=No"),
    is_button_show: z.enum(["T", "F"]).optional().describe("Show button: T=Yes, F=No"),
    expiration_period: z
      .union([z.literal(1), z.literal(3), z.literal(6), z.literal(12)])
      .optional()
      .describe("Expiration period (months): 1, 3, 6, 12"),
    button_show_target: z.enum(["A", "M"]).optional().describe("Target: A=All, M=Members only"),
    show_message_to_non_members: z
      .string()
      .max(30)
      .optional()
      .describe("Message for non-members (max 30 chars)"),
    send_method: z.enum(["A", "M"]).optional().describe("Send method: A=Auto, M=Manual"),
    button_show_method: z
      .enum(["P", "G"])
      .optional()
      .describe("Display type: P=By Product, G=By Item"),
    available_product: z
      .enum(["A", "P", "E"])
      .optional()
      .describe("Product scope: A=All, P=Selected, E=Excluded"),
    available_product_list: z
      .array(z.number().int())
      .max(200)
      .optional()
      .describe("List of product IDs for available/excluded products"),
  })
  .strict();

export type RestockNotificationParams = z.infer<typeof RestockNotificationParamsSchema>;
export type RestockNotificationUpdateParams = z.infer<typeof RestockNotificationUpdateParamsSchema>;
