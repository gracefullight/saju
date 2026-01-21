import { z } from "zod";

export const ThemeTypeSchema = z
  .enum(["pc", "mobile"])
  .default("pc")
  .describe("Type of theme (pc or mobile)");

export const ThemesSearchParamsSchema = z
  .object({
    type: ThemeTypeSchema.optional(),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
  })
  .strict();

export const ThemesRetrieveParamsSchema = z
  .object({
    skin_no: z.number().int().min(1).describe("Skin number"),
  })
  .strict();

export const ThemesCountParamsSchema = z
  .object({
    type: ThemeTypeSchema.optional(),
  })
  .strict();

export const ThemePageRetrieveParamsSchema = z
  .object({
    skin_no: z.number().int().min(1).describe("Skin number"),
    path: z.string().min(1).describe("File path (e.g., /sample.html)"),
  })
  .strict();

export type ThemesSearchParams = z.infer<typeof ThemesSearchParamsSchema>;
export type ThemesRetrieveParams = z.infer<typeof ThemesRetrieveParamsSchema>;
export type ThemesCountParams = z.infer<typeof ThemesCountParamsSchema>;
export type ThemePageRetrieveParams = z.infer<typeof ThemePageRetrieveParamsSchema>;
