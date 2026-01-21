export interface ArticleIcon {
  [key: string]: unknown;
  shop_no: number;
  id: number;
  type: "pc" | "mobile";
  group_code: "A" | "B" | "C" | "E";
  path: string;
  display: "T" | "F";
  description: string;
}

export interface IconsResponse {
  [key: string]: unknown;
  icons: ArticleIcon[];
}

export interface IconResponse {
  [key: string]: unknown;
  icons: ArticleIcon;
}
