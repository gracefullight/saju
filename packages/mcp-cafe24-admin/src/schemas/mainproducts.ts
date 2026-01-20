import { z } from "zod";

export const ListMainProductsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    display_group: z.number().int().describe("Main display group number"),
  })
  .strict();

export const CountMainProductsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    display_group: z.number().int().describe("Main display group number"),
  })
  .strict();

export const AddMainProductsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    display_group: z.number().int().describe("Main display group number"),
    product_no: z.array(z.number().int()).min(1).describe("List of product numbers to add"),
  })
  .strict();

export const UpdateMainProductsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    display_group: z.number().int().describe("Main display group number"),
    product_no: z.array(z.number().int()).min(1).describe("Ordered list of product numbers to set"),
    fix_product_no: z
      .array(z.number().int())
      .optional()
      .describe("List of product numbers to fix in display order"),
  })
  .strict();

export const DeleteMainProductParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    display_group: z.number().int().describe("Main display group number"),
    product_no: z.number().int().describe("Product number to remove"),
  })
  .strict();

export type ListMainProductsParams = z.infer<typeof ListMainProductsParamsSchema>;
export type CountMainProductsParams = z.infer<typeof CountMainProductsParamsSchema>;
export type AddMainProductsParams = z.infer<typeof AddMainProductsParamsSchema>;
export type UpdateMainProductsParams = z.infer<typeof UpdateMainProductsParamsSchema>;
export type DeleteMainProductParams = z.infer<typeof DeleteMainProductParamsSchema>;
