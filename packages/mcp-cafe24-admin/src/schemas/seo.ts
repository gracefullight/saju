import { z } from "zod";

export const SeoSettingsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const OgSettingSchema = z
  .object({
    site_name: z.string().optional().describe("Site name"),
    title: z.string().optional().describe("Title"),
    description: z.string().optional().describe("Description"),
  })
  .strict();

export const SeoSettingsUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    common_page_title: z.string().optional().describe("Common page title"),
    common_page_meta_description: z.string().optional().describe("Common page meta description"),
    favicon: z.string().optional().describe("Favicon URL"),
    use_google_search_console: z
      .enum(["T", "F"])
      .optional()
      .describe("Use Google Search Console: T=Yes, F=No"),
    google_search_console: z.string().optional().describe("Google Search Console meta tag content"),
    use_naver_search_advisor: z
      .enum(["T", "F"])
      .optional()
      .describe("Use Naver Search Advisor: T=Yes, F=No"),
    naver_search_advisor: z.string().optional().describe("Naver Search Advisor meta tag content"),
    sns_share_image: z.string().optional().describe("SNS share image URL"),
    use_twitter_card: z.enum(["T", "F"]).optional().describe("Use Twitter Card: T=Yes, F=No"),
    robots_text: z.string().optional().describe("Robots.txt content (PC)"),
    mobile_robots_text: z.string().optional().describe("Robots.txt content (Mobile)"),
    use_missing_page_redirect: z
      .enum(["T", "F"])
      .optional()
      .describe("Use missing page redirect (PC): T=Yes, F=No"),
    missing_page_redirect_url: z.string().optional().describe("Missing page redirect path (PC)"),
    mobile_use_missing_page_redirect: z
      .enum(["T", "F"])
      .optional()
      .describe("Use missing page redirect (Mobile): T=Yes, F=No"),
    mobile_missing_page_redirect_url: z
      .string()
      .optional()
      .describe("Missing page redirect path (Mobile)"),
    use_sitemap_auto_update: z
      .enum(["T", "F"])
      .optional()
      .describe("Auto update sitemap: T=Yes, F=No"),
    use_rss: z.enum(["T", "F"]).optional().describe("Use RSS feed: T=Yes, F=No"),
    display_group: z.number().int().optional().describe("Main display group number"),
    header_tag: z.string().optional().describe("HTML Head tag (PC)"),
    footer_tag: z.string().optional().describe("HTML Body tag (PC)"),
    mobile_header_tag: z.string().optional().describe("HTML Head tag (Mobile)"),
    mobile_footer_tag: z.string().optional().describe("HTML Body tag (Mobile)"),
    og_main: OgSettingSchema.optional().describe("Main page Open Graph settings"),
    og_product: OgSettingSchema.optional().describe("Product page Open Graph settings"),
    og_category: OgSettingSchema.optional().describe("Category page Open Graph settings"),
    og_board: OgSettingSchema.optional().describe("Board page Open Graph settings"),
    llms_text: z
      .string()
      .optional()
      .describe("AI LLM crawler access control text (robots.txt extension)"),
  })
  .strict();

export type SeoSettingsParams = z.infer<typeof SeoSettingsParamsSchema>;
export type OgSetting = z.infer<typeof OgSettingSchema>;
export type SeoSettingsUpdateParams = z.infer<typeof SeoSettingsUpdateParamsSchema>;
