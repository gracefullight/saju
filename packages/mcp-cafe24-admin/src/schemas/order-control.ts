import { z } from "zod";

export const PaymentControlUpdateParamsSchema = z
  .object({
    request: z.object({
      payments_control: z
        .enum(["T", "F"])
        .describe("Restrict manual payment confirmation (T: Enabled, F: Disabled)"),
      direct_url: z.string().url().describe("Redirect URL"),
    }),
  })
  .strict();
