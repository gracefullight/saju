import { z } from "zod";

export const KakaoSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default:1)"),
    kakao_alimtalk_no: z.number().int().optional().describe("Kakao Alimtalk number"),
  })
  .strict();

export const KakaoConfigUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use_kakao_alimtalk: z.enum(["T", "F"]).optional().describe("Use Kakao Alimtalk: T=Yes, F=No"),
    use_sms: z.enum(["T", "F"]).optional().describe("Use SMS: T=Yes, F=No"),
    use_kakao_plus_friend: z
      .enum(["T", "F"])
      .optional()
      .describe("Use Kakao Plus Friend: T=Yes, F=No"),
    plus_friend_profile_image_url: z
      .string()
      .max(255)
      .optional()
      .describe("Plus friend profile image URL"),
    kakao_alimtalk_no: z.number().int().describe("Kakao Alimtalk number"),
  })
  .strict();

export type KakaoSearchParams = z.infer<typeof KakaoSearchParamsSchema>;
export type KakaoConfigUpdateParams = z.infer<typeof KakaoConfigUpdateParamsSchema>;
