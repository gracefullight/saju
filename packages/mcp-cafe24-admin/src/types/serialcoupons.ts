export type SerialCouponBenefitType = "A" | "B" | "C" | "D" | "E" | "I" | "H" | "J" | "F" | "G";
export type SerialCouponPeriodType = "F" | "R" | "M";
export type SerialCouponScope = "P" | "O";
export type SerialCouponApplyType = "U" | "I" | "E";
export type SerialCouponPriceType = "U" | "O" | "P";
export type SerialCouponOrderPriceType = "U" | "I";
export type SerialCouponAmountType = "E" | "I";
export type SerialCouponGenerateMethod = "A" | "M";
export type SerialCouponCodeType = "R" | "S";

export interface SerialCouponDiscountAmount {
  benefit_price: string | null;
}

export interface SerialCouponDiscountRate {
  benefit_percentage: string | null;
  benefit_percentage_round_unit: string | null;
  benefit_percentage_max_price: string | null;
}

export interface SerialCouponGenerateAuto {
  issue_max_count?: number;
  serial_code_length?: number;
}

export interface SerialCoupon {
  shop_no: number;
  coupon_no: string;
  serial_no?: string;
  coupon_name: string;
  coupon_description?: string | null;
  created_date?: string;
  deleted?: "T" | "F";
  is_stopped_issued_coupon?: "T" | "F";
  pause_begin_datetime?: string | null;
  pause_end_datetime?: string | null;
  benefit_text?: string | null;
  benefit_type?: SerialCouponBenefitType;
  benefit_price?: string | null;
  benefit_percentage?: string | null;
  benefit_percentage_round_unit?: string | null;
  benefit_percentage_max_price?: string | null;
  include_regional_shipping_rate?: "T" | "F" | null;
  include_foreign_delivery?: "T" | "F" | null;
  issue_member_join?: "T" | "F" | null;
  issue_member_join_recommend?: "T" | "F" | null;
  issue_member_join_type?: string | null;
  issue_order_amount_type?: string | null;
  issue_order_start_date?: string | null;
  issue_order_end_date?: string | null;
  issue_order_amount_limit?: string | null;
  issue_order_amount_min?: string | null;
  issue_order_amount_max?: string | null;
  issue_order_path?: string | null;
  issue_order_type?: SerialCouponScope | null;
  issue_order_available_product?: SerialCouponApplyType | null;
  issue_order_available_category?: SerialCouponApplyType | null;
  issue_anniversary_type?: string | null;
  issue_anniversary_pre_issue_day?: number | null;
  issue_module_type?: string | null;
  issue_review_count?: number | null;
  issue_review_has_image?: "T" | "F" | null;
  issue_quantity_min?: number | null;
  issue_quntity_type?: string | null;
  issue_max_count?: number | null;
  issue_max_count_by_user?: number | null;
  issue_count_per_once?: number | null;
  issued_count?: string | null;
  issue_member_group_no?: number | null;
  issue_member_group_name?: string | null;
  issue_no_purchase_period?: number | null;
  issue_reserved?: "T" | "F" | null;
  issue_reserved_date?: string | null;
  available_date?: string | null;
  available_period_type?: SerialCouponPeriodType | null;
  available_begin_datetime?: string | null;
  available_end_datetime?: string | null;
  available_site?: string | string[] | null;
  available_scope?: SerialCouponScope | null;
  available_day_from_issued?: number | null;
  available_price_type?: SerialCouponPriceType | null;
  available_order_price_type?: SerialCouponOrderPriceType | null;
  available_min_price?: string | null;
  available_amount_type?: SerialCouponAmountType | null;
  available_payment_method?: string | null;
  available_product?: SerialCouponApplyType | null;
  available_product_list?: number[] | null;
  available_category?: SerialCouponApplyType | null;
  available_category_list?: number[] | null;
  available_coupon_count_by_order?: number | null;
  serial_generate_method?: SerialCouponGenerateMethod | null;
  serial_code_type?: SerialCouponCodeType | null;
  serial_generate_auto?: SerialCouponGenerateAuto | null;
  coupon_image_type?: string | null;
  coupon_image_path?: string | null;
  show_product_detail?: "T" | "F" | null;
  use_notification_when_login?: "T" | "F" | null;
  discount_amount?: SerialCouponDiscountAmount | null;
  discount_rate?: SerialCouponDiscountRate | null;
}

export interface SerialCouponsListResponse {
  serialcoupons: SerialCoupon[];
}

export interface SerialCouponsCreateResponse {
  serialcoupons: SerialCoupon;
}

export interface SerialCouponDeleteResponse {
  serialcoupon: {
    coupon_no: string;
  };
}

export interface SerialCouponCreateRequest {
  shop_no?: number;
  request: {
    coupon_name: string;
    benefit_type: "A" | "B";
    available_period_type: SerialCouponPeriodType;
    available_begin_datetime?: string;
    available_end_datetime?: string;
    available_day_from_issued?: number;
    available_site: string[];
    available_scope: SerialCouponScope;
    available_product: SerialCouponApplyType;
    available_product_list?: number[];
    available_category: SerialCouponApplyType;
    available_category_list?: number[];
    available_amount_type: SerialCouponAmountType;
    available_coupon_count_by_order: number;
    available_price_type?: SerialCouponPriceType;
    available_order_price_type?: SerialCouponOrderPriceType;
    available_min_price?: string;
    discount_amount?: SerialCouponDiscountAmount;
    discount_rate?: SerialCouponDiscountRate;
    serial_generate_method: SerialCouponGenerateMethod;
    serial_code_type: SerialCouponCodeType;
    serial_generate_auto?: SerialCouponGenerateAuto;
  };
}
