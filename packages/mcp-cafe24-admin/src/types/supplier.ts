export interface SupplierManager {
  no: number;
  name: string;
  phone: string;
  email: string;
  use_sms: "T" | "F";
}

export interface Supplier extends Record<string, unknown> {
  shop_no: number;
  supplier_code: string;
  supplier_name: string;
  status: "A" | "P" | "N";
  commission: string;
  payment_period: "0" | "C" | "B" | "A";
  business_item: string;
  payment_type: "P" | "D";
  supplier_type: "WS" | "SF" | "BS" | "ET";
  use_supplier: "T" | "F";
  created_date: string;
  updated_date: string;
  country_code: string;
  zipcode: string;
  address1: string;
  address2: string;
  manager_information: SupplierManager[];
  payment_start_day: number | null;
  payment_end_day: number | null;
  payment_start_date: number;
  payment_end_date: number;
  trading_type: "D" | "C";
  bank_code: string;
  bank_account_no: string;
  bank_account_name: string;
  company_registration_no: string;
  president_name: string;
  company_name: string;
  company_condition: string;
  company_line: string;
  phone: string;
  fax: string;
  payment_method?: number;
  market_country_code?: string;
  market_zipcode?: string;
  market_address1?: string;
  market_address2?: string;
  exchange_country_code?: string;
  exchange_zipcode?: string;
  exchange_address1?: string;
  exchange_address2?: string;
  homepage_url?: string;
  mall_url?: string;
  account_start_date?: string;
  account_stop_date?: string;
  show_supplier_info?: string;
  memo?: string;
  company_introduction?: string;
}

export interface ListSuppliersResponse extends Record<string, unknown> {
  suppliers: Supplier[];
}

export interface CountSuppliersResponse extends Record<string, unknown> {
  count: number;
}

export interface SupplierResponse extends Record<string, unknown> {
  supplier: Supplier;
}
