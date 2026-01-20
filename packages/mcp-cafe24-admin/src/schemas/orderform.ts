import { z } from "zod";

export const OrderFormParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default:1)"),
    order_form_no: z.number().int().optional().describe("Order form number"),
  })
  .strict();

export const OrderFormUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default:1)"),
    order_form_no: z.number().int().describe("Order form number"),
    content: z.string().describe("Form content"),
    use: z.enum(["T", "F"]).describe("Enable form: T=Yes, F=No"),
    use_order_message: z.enum(["T", "F"]).optional().describe("Enable order message: T=Yes, F=No"),
    order_message: z.string().optional().describe("Order message"),
    use_order_guide_url: z
      .enum(["T", "F"])
      .optional()
      .describe("Enable order guide URL: T=Yes, F=No"),
    order_guide_url: z.string().max(500).optional().describe("Order guide URL"),
  })
  .strict();

export type OrderFormParams = z.infer<typeof OrderFormParamsSchema>;
export type OrderFormUpdateParams = z.infer<typeof OrderFormUpdateParamsSchema>;
