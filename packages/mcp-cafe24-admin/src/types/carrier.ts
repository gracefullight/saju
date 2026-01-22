export interface CarrierCategory {
  category_no: number;
  category_name?: string;
}

export interface DomesticShippingFee {
  country_code?: string;
  conditional: string;
  min_value: string;
  max_value: string;
  shipping_fee: string;
}

export interface ShippingFeeSettingDomestic {
  shipping_fee_type: "T" | "R" | "M" | "D" | "W" | "C" | "N";
  shipping_fee?: string | null;
  min_price?: string | null;
  use_product_category: "O" | "F";
  product_category_list?: CarrierCategory[];
  shipping_fee_criteria: "D" | "A";
  domestic_shipping_fee_list?: DomesticShippingFee[];
  available_shipping_zone?: string | null;
  available_shipping_zone_list?: string[] | null;
  available_order_time?: string | null;
  start_time?: string | null;
  end_time?: string | null;
}

export interface OverseaShippingCountry {
  country_code: string;
  country_name?: string;
}

export interface OverseaShippingFee {
  country_code: string;
  country_name?: string;
  conditional: string;
  min_value: string;
  max_value: string;
  shipping_fee: string;
}

export interface AdditionalHandlingFee {
  country_code: string;
  country_name?: string;
  text?: string;
  min_value: string;
  max_value: string;
  additional_handling_fee: string;
  unit: "W" | "P";
  rounding_unit?: "F" | "0" | "1" | "2" | "3" | null;
  rounding_rule?: "L" | "U" | "C" | null;
}

export interface ShippingFeeSettingOversea {
  shipping_fee_criteria?: string | null;
  shipping_country_list?: OverseaShippingCountry[];
  country_shipping_fee_list?: OverseaShippingFee[];
  additional_handling_fee: "T" | "F";
  additional_handling_fee_list?: AdditionalHandlingFee[];
  maximum_quantity?: number | null;
  product_category_limit?: "T" | "F" | null;
  product_category_limit_list?: CarrierCategory[] | null;
}

export interface ShippingFeeSettingDetail {
  shipping_type: "A" | "B" | "C" | "F";
  available_shipping_zone?: string;
  min_shipping_period?: number;
  max_shipping_period?: number;
  shipping_information?: string;
  shipping_fee_setting_domestic?: ShippingFeeSettingDomestic;
  shipping_fee_setting_oversea?: ShippingFeeSettingOversea;
}

export interface ExpressExceptionSetting {
  weight?: string;
  volume?: string;
  shipping_type?: string | null;
  box_type?: string | null;
  sender_name?: string;
  sender_cellphone?: string;
  sender_phone?: string | null;
  sender_zipcode?: string | null;
  sender_address1?: string | null;
  sender_address2?: string | null;
}

export interface Carrier extends Record<string, unknown> {
  shop_no: number;
  carrier_id: number;
  shipping_carrier_code: string;
  shipping_carrier: string;
  track_shipment_url?: string | null;
  shipping_type?: "A" | "B" | "C" | "F";
  contact: string;
  secondary_contact?: string;
  email: string;
  default_shipping_fee?: string | null;
  homepage_url?: string;
  default_shipping_carrier?: "T" | "F";
  shipping_fee_setting: "T" | "F";
  shipping_fee_setting_detail?: ShippingFeeSettingDetail;
  express_exception_setting?: ExpressExceptionSetting;
  links?: { rel: string; href: string }[];
}

export interface ListCarriersResponse extends Record<string, unknown> {
  carriers: Carrier[];
}

export interface CarrierResponse extends Record<string, unknown> {
  carrier: Carrier;
}
