import type { SalesStat, SummaryStat } from "./store.js";

export interface DailySales {
  date: string;
  sales_count: number;
  sales_amount: number;
}

export interface OrderAmount {
  order_price_amount: string;
  shipping_fee: string;
  points_spent_amount: string;
  credits_spent_amount: string;
  coupon_discount_price: string;
  coupon_shipping_fee_amount: string;
  membership_discount_amount: string;
  shipping_fee_discount_amount: string;
  set_product_discount_amount: string;
  app_discount_amount: string;
  point_incentive_amount: string;
  total_amount_due: string;
  payment_amount: string;
  market_other_discount_amount: string;
  tax: string;
}

export interface ShippingFeeDetail {
  shipping_group_code: number;
  supplier_code: string;
  shipping_fee: string;
  cancel_shipping_fee: string;
  additional_shipping_fee: string;
  refunded_shipping_fee: string;
  return_shipping_fee: string;
  items: string[];
}

export interface RegionalSurchargeDetail {
  shipping_group_code: number;
  supplier_code: string;
  regional_surcharge_amount: string;
  cancel_shipping_fee: string;
  additional_shipping_fee: string;
  refunded_shipping_fee: string;
  return_shipping_fee: string;
  items: string[];
}

export interface TaxDetail {
  name: string;
  amount: string;
  price_before_tax: string;
  price_before_tax_type: string;
  order_item_code: string[];
  country_tax_rate: string;
  region_tax: {
    rate: string;
    taxation_method: string;
  };
  product_tax_override: {
    rate: string | null;
    taxation_method: string | null;
  };
  shipping_tax_override: {
    rate: string | null;
    taxation_method: string | null;
  };
}

export interface AdditionalOrderInfo {
  id: number;
  name: string;
  value: string;
  input_type: string;
  product_type: string;
  applied_product_list: string[];
}

export interface Order {
  shop_no: number;
  currency: string;
  order_id: string;
  market_id: string;
  market_order_no: string | null;
  member_id: string;
  member_email: string;
  member_authentication: string;
  billing_name: string;
  bank_code: string | null;
  bank_code_name: string | null;
  payment_method: string[];
  payment_method_name: string[];
  payment_gateway_names: string[] | null;
  sub_payment_method_name: string | null;
  sub_payment_method_code: string | null;
  transaction_ids: string[] | null;
  paid: "T" | "F" | "M";
  canceled: "T" | "F" | "M";
  order_date: string;
  first_order: "T" | "F";
  payment_date: string | null;
  order_from_mobile: "T" | "F";
  use_escrow: "T" | "F";
  bank_account_no: string | null;
  bank_account_owner_name: string | null;
  market_seller_id: string | null;
  payment_amount: string;
  cancel_date: string | null;
  order_place_name: string | null;
  order_place_id: string | null;
  payment_confirmation: "T" | "F" | null;
  commission: string;
  postpay: "T" | "F";
  admin_additional_amount: string;
  additional_shipping_fee: string;
  international_shipping_insurance: string;
  additional_handling_fee: string;
  shipping_type: "A" | "B";
  shipping_type_text: string;
  shipping_status: "F" | "M" | "T" | "W" | "X";
  wished_delivery_date: string;
  wished_delivery_time: string | null;
  wished_carrier_id: number | null;
  wished_carrier_name: string | null;
  return_confirmed_date: string | null;
  total_supply_price: string;
  naver_point: number;
  store_pickup: "T" | "F";
  easypay_name: string;
  loan_status: "OK" | "NG" | "ER" | null;
  subscription: "T" | "F";
  multiple_addresses: "T" | "F";
  exchange_rate: string;
  customer_group_no_when_ordering: number;
  initial_order_amount: OrderAmount;
  actual_order_amount: OrderAmount;
  shipping_fee_detail: ShippingFeeDetail[];
  regional_surcharge_detail: RegionalSurchargeDetail[];
  tax_detail: TaxDetail[];
  additional_order_info_list: AdditionalOrderInfo[];
}

export interface OrderUpdateResult {
  shop_no: number;
  order_id: string;
  process_status: "prepare" | "prepareproduct" | "hold" | "unhold" | null;
  order_item_code: string[] | null;
  purchase_confirmation: "T" | "F" | null;
  collect_points: "T" | "F";
  show_shipping_address: "T" | "F" | null;
}

export interface BulkOrderUpdateResponse {
  orders: OrderUpdateResult[];
}

export interface SingleOrderUpdateResponse {
  order: OrderUpdateResult;
}

export interface OrderStatus {
  status_name_id: number;
  status_type: string;
  basic_name: string;
  custom_name?: string;
  reservation_custom_name?: string;
}

export interface ShippingInfo {
  key: string;
  use: string;
  required: string;
}

export interface PrintType {
  invoice_print?: string;
  receipt_print?: string;
  address_print?: string;
}

export interface OrderFormSetting {
  shop_no?: number;
  buy_limit_type?: string;
  guest_purchase_button_display?: string;
  junior_purchase_block?: string;
  reservation_order?: string;
  discount_amount_display?: string;
  order_item_delete?: string;
  quick_signup?: string;
  check_order_info?: string;
  order_form_input_type?: string;
  shipping_info?: ShippingInfo[];
  order_info?: ShippingInfo[];
  china_taiwan_id_input?: string;
  print_type?: PrintType;
  orderform_additional_enabled?: string;
}

export type { SalesStat, SummaryStat };
