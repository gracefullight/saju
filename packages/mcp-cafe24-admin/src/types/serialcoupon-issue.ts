export interface SerialCouponIssue {
  shop_no: number;
  coupon_no: string;
  serial_code: string;
  member_id: string;
  verify: "Y" | "N";
  verify_datetime: string | null;
  used_datetime: string | null;
  deleted: "T" | "F";
}

export interface SerialCouponIssueListResponse {
  serialcoupons: SerialCouponIssue[];
}

export interface SerialCouponIssueSummary {
  shop_no: number;
  coupon_no: string;
  serial_code: string;
}

export interface SerialCouponIssueCreateResponse {
  serialcoupons: SerialCouponIssueSummary[];
}

export interface SerialCouponIssueCreateRequest {
  shop_no?: number;
  request: {
    serial_code_list: string[];
  };
}
