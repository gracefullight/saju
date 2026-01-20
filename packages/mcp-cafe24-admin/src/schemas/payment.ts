import { z } from "zod";

export const PaymentSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const PaymentSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use_escrow: z.enum(["T", "F"]).optional().describe("Enable Escrow: T=Yes, F=No"),
    use_escrow_account_transfer: z
      .enum(["T", "F"])
      .optional()
      .describe("Enable Escrow (Account Transfer): T=Yes, F=No"),
    use_escrow_virtual_account: z
      .enum(["T", "F"])
      .optional()
      .describe("Enable Escrow (Virtual Account): T=Yes, F=No"),
    pg_shipping_registration: z
      .enum(["A", "M"])
      .optional()
      .describe("PG Shipping Registration: A=Auto (8PM daily), M=Manual"),
    use_direct_pay: z
      .enum(["T", "F"])
      .optional()
      .describe("Enable Direct Pay/Quick Pay: T=Yes, F=No"),
    payment_display_type: z
      .enum(["T", "L"])
      .optional()
      .describe("Payment Method Display: T=Text, L=Logo Icon"),
  })
  .strict();

export type PaymentSettingParams = z.infer<typeof PaymentSettingParamsSchema>;
export type PaymentSettingUpdateParams = z.infer<typeof PaymentSettingUpdateParamsSchema>;
