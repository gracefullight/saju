export interface RegionalSurchargeItem extends Record<string, unknown> {
  regional_surcharge_no: number;
  region_name: string;
  surcharge_region_name: string | null;
  country_code: string | null;
  start_zipcode: string;
  end_zipcode: string;
  regional_surcharge_amount: string;
}

export interface RegionalSurcharge extends Record<string, unknown> {
  shop_no: number;
  use_regional_surcharge: "T" | "F";
  region_setting_type: "A" | "N" | "Z";
  regional_surcharge_list?: RegionalSurchargeItem[];
  jeju_surcharge_amount: string | null;
  remote_area_surcharge_amount: string | null;
}

export interface RegionalSurchargeResponse {
  regionalsurcharge: RegionalSurcharge;
}
