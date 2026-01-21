export interface CustomerCoupon {
  shop_no: number;
  coupon_no: string;
  issue_no: string;
  coupon_name: string;
  available_price_type: "U" | "O" | "P";
  available_price_type_detail: "U" | "I" | null;
  available_min_price: string | null;
  available_payment_methods: string[];
  benefit_type: "A" | "B" | "C" | "D" | "E" | "I" | "H" | "F" | "G";
  benefit_price: string | null;
  benefit_percentage: string | null;
  benefit_percentage_round_unit: string | null;
  benefit_percentage_max_price: string | null;
  credit_amount: string | null;
  issued_date: string;
  available_begin_datetime: string;
  available_end_datetime: string;
}

export interface CustomerCouponsListResponse {
  coupons: CustomerCoupon[];
}

export interface CustomerCouponsCountResponse {
  count: number;
}

export interface CustomerCouponDeleteResponse {
  coupon: {
    shop_no: number;
    coupon_no: string;
    issue_no: string[];
  };
}
