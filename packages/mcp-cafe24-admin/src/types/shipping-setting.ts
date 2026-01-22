import type { Cafe24Enum } from "@/types/common.js";

export interface ShippingPeriod {
  minimum: number;
  maximum: number;
}

export interface GeneralShippingRate {
  min_value: string;
  max_value: string;
  shipping_fee: string;
}

export interface GeneralOverseaShippingCountry {
  country_code: string;
}

export interface CountryShippingFee {
  country_code: string;
  conditional: "price" | "quantity";
  min_value: string;
  max_value: string;
  shipping_fee: string;
}

export interface GeneralReturnAddress {
  zipcode: string;
  ziptype: string;
  address1: string;
  address2: string;
}

export interface PackageVolume {
  width: string;
  length: string;
  height: string;
}

export interface WishedDeliveryDate {
  use: Cafe24Enum;
  range: {
    minimum: number;
    maximum: number;
  };
  default: {
    minimum: number | null;
    use_fast_delivery: Cafe24Enum;
  };
}

export interface WishedDeliveryTimeRange {
  start_hour: string;
  end_hour: string;
}

export interface WishedDeliveryTime {
  use: Cafe24Enum;
  range: WishedDeliveryTimeRange[];
  default: {
    range: WishedDeliveryTimeRange;
    use_fast_delivery: Cafe24Enum;
  };
}

export interface GeneralCountryHsCode {
  hs_code: string;
  country_code: string;
}

export interface OverseaAdditionalFee {
  country_code: string;
  fee_name: string;
  min_value: string;
  max_value: string;
  additional_fee: string;
  unit: "W" | "P";
  rounding_unit: "F" | "0" | "1" | "2" | "3";
  rounding_rule: "L" | "U" | "C";
}

export interface ApplicableSupplier {
  supplier_code: string;
  supplier_id: string;
}

export interface ShippingCompanyType {
  carrier_id: number;
  is_selected: Cafe24Enum;
  shipping_carrier_code: string;
  shipping_type: "A" | "B" | string;
  shipping_carrier: string;
}

export interface ShippingSetting extends Record<string, unknown> {
  shop_no: number;
  shipping_method:
    | "shipping_01"
    | "shipping_02"
    | "shipping_04"
    | "shipping_05"
    | "shipping_06"
    | "shipping_07"
    | "shipping_08"
    | "shipping_09"
    | "shipping_10";
  shipping_etc: string | null;
  shipping_type: "A" | "C" | "B";
  international_shipping_fee_criteria: "B" | "E" | null;
  shipping_place: string | null;
  shipping_period: ShippingPeriod;
  product_weight: string;
  shipping_fee_type: "T" | "R" | "M" | "D" | "W" | "C" | "N";
  shipping_fee: string | null;
  free_shipping_price: string | null;
  shipping_fee_by_quantity: string | null;
  shipping_rates: GeneralShippingRate[] | null;
  shipping_fee_criteria: "D" | "L" | "A" | "R";
  prepaid_shipping_fee: "C" | "P" | "B";
  oversea_shipping_country: Cafe24Enum;
  oversea_shipping_country_list: GeneralOverseaShippingCountry[] | null;
  country_shipping_fee: Cafe24Enum;
  country_shipping_fee_list: CountryShippingFee[] | null;
  international_shipping_insurance: Cafe24Enum;
  return_address: GeneralReturnAddress;
  package_volume: PackageVolume;
  wished_delivery_date: WishedDeliveryDate;
  wished_delivery_time: WishedDeliveryTime;
  hs_code: string | null;
  country_hs_code: GeneralCountryHsCode[] | null;
  oversea_additional_fee: Cafe24Enum;
  oversea_additional_fee_list: OverseaAdditionalFee[] | null;
  individual_shipping_fee: Cafe24Enum;
  individual_fee_calculation_type: "P" | "I" | null;
  supplier_shipping_fee: Cafe24Enum;
  supplier_selection: "A" | "P" | null;
  applicable_suppliers: ApplicableSupplier[] | null;
  supplier_shipping_calculation: "A" | "S" | null;
  supplier_regional_surcharge: "A" | "S" | null;
  additional_shipping_fee: string | null;
  shipping_company_type: ShippingCompanyType[] | null;
}

export interface RetrieveShippingSettingResponse {
  shipping: ShippingSetting;
}

export interface UpdateShippingSettingRequest {
  shop_no: number;
  request: Partial<Omit<ShippingSetting, "shop_no">>;
}

export interface UpdateShippingSettingResponse {
  shipping: ShippingSetting;
}

export interface AdditionalFee extends Record<string, unknown> {
  shop_no: number;
  oversea_additional_fee: "T" | "F";
  country_code: string;
  fee_name: string;
  min_value: string;
  max_value: string;
  additional_fee: string;
  unit: "W" | "P";
  rounding_unit: "F" | "0" | "1" | "2" | "3";
  rounding_rule: "L" | "U" | "C";
}

export interface AdditionalFeesResponse {
  additionalfees: AdditionalFee[];
}
