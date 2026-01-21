export interface Theme {
  [key: string]: unknown;
  skin_no: number;
  skin_code: string;
  skin_name: string;
  skin_thumbnail_url: string;
  usage_type: "S" | "C" | "I" | "M" | "N";
  editor_type: "H" | "D" | "W" | "E";
  parent_skin_no: number | null;
  seller_id: string | null;
  seller_skin_code: string | null;
  design_purchase_no: number;
  design_product_code: string | null;
  language_code: "ko_KR" | "en_US" | "zh_CN" | "zh_TW" | "ja_JP" | "pt_PT" | "es_ES" | "vi_VN";
  published_in: string;
  created_date: string;
  updated_date: string | null;
  skin_lock: "T" | "F";
  preview_domain: string[];
}

export interface ThemesResponse {
  [key: string]: unknown;
  themes: Theme[];
}

export interface ThemesCountResponse {
  [key: string]: unknown;
  count: number;
}

export interface ThemeResponse {
  [key: string]: unknown;
  theme: Theme;
}

export interface ThemePage {
  [key: string]: unknown;
  skin_no: string;
  skin_code: string;
  path: string;
  source: string;
  display_location?: string;
}

export interface ThemePageResponse {
  [key: string]: unknown;
  page: ThemePage;
}
