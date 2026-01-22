import { z } from "zod";

export const SendSMSSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    request: z
      .object({
        sender_no: z.number().int().describe("Sender ID (Unique number of sender)"),
        content: z
          .string()
          .describe("Message content. Single SMS max 90 bytes, LMS max 2000 bytes."),
        recipients: z.array(z.string()).max(100).optional().describe("Array of recipient numbers"),
        member_id: z.array(z.string()).max(100).optional().describe("Array of member IDs"),
        group_no: z.number().int().optional().describe("Group number (0: All customer tiers)"),
        exclude_unsubscriber: z
          .enum(["T", "F"])
          .default("T")
          .describe("Whether to exclude SMS rejected recipients (T: exclude, F: include)"),
        type: z
          .enum(["SMS", "LMS"])
          .default("SMS")
          .describe("Type of SMS (SMS: short message, LMS: long message)"),
        title: z.string().optional().describe("Title for LMS messages"),
      })
      .strict(),
  })
  .strict()
  .describe("Parameters for sending SMS/LMS");

export type SendSMS = z.infer<typeof SendSMSSchema>;

export const GetSMSBalanceSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
  })
  .strict()
  .describe("Parameters for getting SMS balance");

export type GetSMSBalance = z.infer<typeof GetSMSBalanceSchema>;

export const ListSMSReceiversSchema = z
  .object({
    recipient_type: z
      .enum(["All", "S", "A"])
      .optional()
      .describe("Recipient classification (All, S: Supplier, A: Admin)"),
    supplier_name: z.string().optional().describe("Supplier name"),
    supplier_id: z.string().optional().describe("Supplier ID"),
    user_name: z.string().optional().describe("Admin name"),
    user_id: z.string().optional().describe("Admin ID"),
    manager_name: z.string().optional().describe("Person In Charge (PIC)"),
    cellphone: z.string().optional().describe("Mobile"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location of list"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe("Maximum number of items to return"),
  })
  .strict()
  .describe("Parameters for listing SMS receivers");

export type ListSMSReceivers = z.infer<typeof ListSMSReceiversSchema>;

export const ListSMSSendersSchema = z
  .object({
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location of list"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe("Maximum number of items to return"),
  })
  .strict()
  .describe("Parameters for listing SMS senders");

export type ListSMSSenders = z.infer<typeof ListSMSSendersSchema>;
