import { z } from "zod";

export const SocialAppleParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const SocialAppleUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use_apple_login: z
      .enum(["T", "F"])
      .optional()
      .describe("Use Apple Login: T=Enabled, F=Disabled"),
    client_id: z.string().max(300).optional().describe("Client ID (Apple Service ID Identifier)"),
    team_id: z.string().max(300).optional().describe("Team ID (Apple App ID Prefix)"),
    key_id: z.string().max(300).optional().describe("Key ID (Apple Key ID)"),
    auth_key_file_name: z
      .string()
      .max(30)
      .optional()
      .describe("Auth Key file name (e.g., .p8 file)"),
    auth_key_file_contents: z
      .string()
      .max(300)
      .optional()
      .describe("Auth Key file contents (content of .p8 file without newlines)"),
    use_certification: z
      .enum(["T", "F"])
      .optional()
      .describe("Use Apple Login Certification: T=Enabled, F=Disabled"),
  })
  .strict();

export type SocialAppleParams = z.infer<typeof SocialAppleParamsSchema>;
export type SocialAppleUpdateParams = z.infer<typeof SocialAppleUpdateParamsSchema>;
