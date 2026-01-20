import { z } from "zod";

export const CategoryProductSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    category_no: z.number().int().describe("Category number"),
    product_no: z.string().optional().describe("Product numbers (comma separated)"),
    display: z.enum(["T", "F"]).optional().describe("Display status"),
    selling: z.enum(["T", "F"]).optional().describe("Selling status"),
    product_code: z.string().optional().describe("Product codes (comma separated)"),
    product_tag: z.string().optional().describe("Product tags (comma separated)"),
    custom_product_code: z.string().optional().describe("Custom product codes (comma separated)"),
    product_name: z.string().optional().describe("Product names (comma separated)"),
    eng_product_name: z.string().optional().describe("English product names (comma separated)"),
    supply_product_name: z.string().optional().describe("Supply product names (comma separated)"),
    internal_product_name: z
      .string()
      .optional()
      .describe("Internal product names (comma separated)"),
    model_name: z.string().optional().describe("Model names (comma separated)"),
    price_min: z.string().optional().describe("Minimum price"),
    price_max: z.string().optional().describe("Maximum price"),
    created_start_date: z.string().optional().describe("Created start date (YYYY-MM-DD)"),
    created_end_date: z.string().optional().describe("Created end date (YYYY-MM-DD)"),
    updated_start_date: z.string().optional().describe("Updated start date (YYYY-MM-DD)"),
    updated_end_date: z.string().optional().describe("Updated end date (YYYY-MM-DD)"),
    category: z.string().optional().describe("Category number"),
    category_unapplied: z.enum(["T"]).optional().describe("Search unapplied category"),
    include_sub_category: z.enum(["T"]).optional().describe("Include sub-categories"),
    product_weight: z.string().optional().describe("Product weight"),
    sort: z.enum(["created_date", "updated_date", "product_name"]).optional().describe("Sort by"),
    order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
    embed: z.string().optional().describe("Embed resources (comma separated)"),
  })
  .strict();

export type CategoryProductSearchParams = z.infer<typeof CategoryProductSearchParamsSchema>;
