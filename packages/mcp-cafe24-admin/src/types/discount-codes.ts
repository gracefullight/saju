export type DiscountTruncationUnit = "C" | "B" | "F" | "O" | "T" | "M" | "H";

export interface DiscountCode {
  shop_no: number;
  discount_code_no: number;
  discount_code: string;
  discount_code_name: string;
  available_product_type: "A" | "P" | "C";
  available_start_date: string;
  available_end_date: string;
  created_date?: string;
  issued_count?: number;
  available_issue_count?: number;
  discount_value?: number;
  discount_truncation_unit?: DiscountTruncationUnit;
  discount_max_price?: number;
  available_product?: number[] | null;
  available_category?: number[] | null;
  available_min_price?: number;
  available_user?: "M" | "A";
  max_usage_per_user?: number;
}

export interface DiscountCodesListResponse {
  discountcodes: DiscountCode[];
}

export interface DiscountCodeResponse {
  discountcode: DiscountCode;
}

export interface DiscountCodeDeleteResponse {
  discountcode: {
    discount_code_no: number;
  };
}

export interface DiscountCodeCreateRequest {
  shop_no?: number;
  request: {
    discount_code: string;
    discount_code_name: string;
    discount_value: number;
    discount_truncation_unit: DiscountTruncationUnit;
    discount_max_price: number;
    available_start_date: string;
    available_end_date: string;
    available_product_type?: "A" | "P" | "C";
    available_product?: number[] | null;
    available_category?: number[] | null;
    available_min_price?: number;
    available_issue_count?: number;
    available_user?: "M" | "A";
    max_usage_per_user?: number;
  };
}

export interface DiscountCodeUpdateRequest {
  shop_no?: number;
  request: {
    discount_code?: string;
    discount_code_name?: string;
    discount_value?: number;
    discount_truncation_unit?: DiscountTruncationUnit;
    discount_max_price?: number;
    available_start_date?: string;
    available_end_date?: string;
    available_product_type?: "A" | "P" | "C";
    available_product?: number[] | null;
    available_category?: number[] | null;
    available_min_price?: number;
    available_issue_count?: number;
    available_user?: "M" | "A";
    max_usage_per_user?: number;
  };
}
