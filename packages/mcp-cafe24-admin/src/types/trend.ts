export interface Trend extends Record<string, unknown> {
  shop_no: number;
  trend_code: string;
  trend_name: string;
  use_trend: "T" | "F";
  created_date: string;
  product_count?: number;
}

export interface TrendsResponse {
  trends: Trend[];
}

export interface TrendCountResponse {
  count: number;
}
