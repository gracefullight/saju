import { z } from "zod";

export const ProductSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const ProductSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use_adult_certification: z
      .enum(["T", "F"])
      .optional()
      .describe("Use adult certification: T=Yes, F=No"),
    use_review_board: z.enum(["T", "F"]).optional().describe("Use review board: T=Yes, F=No"),
    use_qna_board: z.enum(["T", "F"]).optional().describe("Use Q&A board: T=Yes, F=No"),
    review_board_no: z.number().int().optional().describe("Review board number"),
    qna_board_no: z.number().int().optional().describe("Q&A board number"),
    product_stock_display: z
      .enum(["A", "S", "H"])
      .optional()
      .describe("Product stock display: A=All, S=Sold out only, H=Hidden"),
    use_basket_discount: z.enum(["T", "F"]).optional().describe("Use basket discount: T=Yes, F=No"),
  })
  .strict();

export type ProductSettingParams = z.infer<typeof ProductSettingParamsSchema>;
export type ProductSettingUpdateParams = z.infer<typeof ProductSettingUpdateParamsSchema>;
