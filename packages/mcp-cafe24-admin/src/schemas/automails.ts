import { z } from "zod";

const Cafe24EnumSchema = z.enum(["T", "F"]);

export const AutomailSettingSchema = z.object({
  type: z.string().describe("Email template type code"),
  use_customer: Cafe24EnumSchema.describe("Use for Customer"),
  use_admin: Cafe24EnumSchema.describe("Use for Admin"),
  use_supplier: Cafe24EnumSchema.describe("Use for Supplier"),
});

export const RetrieveAutomailsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
  })
  .strict();

export const UpdateAutomailsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    requests: z.array(AutomailSettingSchema).describe("List of automail settings to update"),
  })
  .strict();

export type RetrieveAutomails = z.infer<typeof RetrieveAutomailsSchema>;
export type UpdateAutomails = z.infer<typeof UpdateAutomailsSchema>;
