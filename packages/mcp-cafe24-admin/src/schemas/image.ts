import { z } from "zod";

export const ImageSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const ProductImageSizeSchema = z
  .object({
    detail_image_width: z.number().int().min(1).optional().describe("Detail image width"),
    detail_image_height: z.number().int().min(1).optional().describe("Detail image height"),
    list_image_width: z.number().int().min(1).optional().describe("List image width"),
    list_image_height: z.number().int().min(1).optional().describe("List image height"),
    tiny_image_width: z.number().int().min(1).optional().describe("Tiny/small list image width"),
    tiny_image_height: z.number().int().min(1).optional().describe("Tiny/small list image height"),
    zoom_image_width: z.number().int().min(1).optional().describe("Zoom image width"),
    zoom_image_height: z.number().int().min(1).optional().describe("Zoom image height"),
    small_image_width: z.number().int().min(1).optional().describe("Small/thumbnail image width"),
    small_image_height: z.number().int().min(1).optional().describe("Small/thumbnail image height"),
  })
  .strict();

export const ImageSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    product_image_size: ProductImageSizeSchema.describe("Product image size settings"),
  })
  .strict();

export type ImageSettingParams = z.infer<typeof ImageSettingParamsSchema>;
export type ProductImageSize = z.infer<typeof ProductImageSizeSchema>;
export type ImageSettingUpdateParams = z.infer<typeof ImageSettingUpdateParamsSchema>;
