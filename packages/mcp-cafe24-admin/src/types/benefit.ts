export interface PeriodSale {
  product_list?: number[] | null;
  add_category_list?: number[] | null;
  except_category_list?: number[] | null;
  discount_purchasing_quantity?: number | null;
  discount_value: string;
  discount_value_unit: "P" | "W";
  discount_truncation_unit?: "O" | "T" | "H" | null;
  discount_truncation_method?: "U" | "D" | "R" | null;
}

export interface Benefit {
  shop_no: number;
  benefit_no: number;
  use_benefit: "T" | "F";
  benefit_name: string;
  benefit_division: "D" | "P";
  benefit_type: "DP" | "DR" | "DQ" | "DM" | "DN" | "DV" | "PG" | "PB";
  use_benefit_period: "T" | "F" | null;
  benefit_start_date: string | null;
  benefit_end_date: string | null;
  platform_types: ("P" | "M" | "A")[];
  use_group_binding?: "A" | "N" | "M" | null;
  customer_group_list?: number[];
  product_binding_type?: "A" | "P" | "E" | "C" | null;
  use_except_category?: "T" | "F" | null;
  available_coupon?: "T" | "F";
  icon_url?: string | null;
  created_date?: string;
  period_sale?: PeriodSale | null;
  repurchase_sale?: Record<string, unknown> | null;
  bulk_purchase_sale?: Record<string, unknown> | null;
  member_sale?: Record<string, unknown> | null;
  new_product_sale?: Record<string, unknown> | null;
  shipping_fee_sale?: Record<string, unknown> | null;
  gift?: Record<string, unknown> | null;
  gift_product_bundle?: Record<string, unknown> | null;
}

export interface BenefitsResponse {
  benefits: Benefit[];
}

export interface BenefitsCountResponse {
  count: number;
}

export interface BenefitResponse {
  benefit: Benefit;
}

export interface BenefitCreateRequest {
  shop_no?: number;
  request: {
    use_benefit: "T" | "F";
    benefit_name: string;
    benefit_division: "D" | "P";
    benefit_type: "DP" | "DR" | "DQ" | "DM" | "DN" | "DV" | "PG" | "PB";
    use_benefit_period?: "T" | "F";
    benefit_start_date?: string;
    benefit_end_date?: string;
    platform_types: ("P" | "M" | "A")[];
    use_group_binding?: "A" | "N" | "M";
    customer_group_list?: number[];
    product_binding_type?: "A" | "P" | "E" | "C";
    use_except_category?: "T" | "F";
    available_coupon?: "T" | "F";
    icon_url?: string;
    period_sale?: PeriodSale;
    repurchase_sale?: Record<string, unknown>;
    bulk_purchase_sale?: Record<string, unknown>;
    member_sale?: Record<string, unknown>;
    new_product_sale?: Record<string, unknown>;
    shipping_fee_sale?: Record<string, unknown>;
    gift?: Record<string, unknown>;
    gift_product_bundle?: Record<string, unknown>;
  };
}

export interface BenefitUpdateRequest {
  shop_no?: number;
  request: {
    use_benefit?: "T" | "F";
    benefit_name?: string;
    use_benefit_period?: "T" | "F";
    benefit_start_date?: string;
    benefit_end_date?: string;
    platform_types?: ("P" | "M" | "A")[];
    use_group_binding?: "A" | "N" | "M";
    customer_group_list?: number[];
    product_binding_type?: "A" | "P" | "E" | "C";
    use_except_category?: "T" | "F";
    available_coupon?: "T" | "F";
    period_sale?: PeriodSale;
    gift?: Record<string, unknown>;
    gift_product_bundle?: Record<string, unknown>;
    new_product_sale?: Record<string, unknown>;
    shipping_fee_sale?: Record<string, unknown>;
    icon_url?: string;
  };
}
