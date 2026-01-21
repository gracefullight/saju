export interface CustomerPlusApp {
  [key: string]: unknown;
  shop_no: number;
  os_type: "ios" | "android";
  install_date: string;
  auto_login_flag: "T" | "F";
  use_push_flag: "T" | "F";
}

export interface CustomerPlusAppResponse {
  [key: string]: unknown;
  plusapp: CustomerPlusApp[];
}

export interface CustomerPlusAppParams {
  shop_no?: number;
  member_id: string;
}
