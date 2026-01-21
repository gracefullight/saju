export interface CouponIssuanceCustomer {
  shop_no: number;
  coupon_no: string;
  member_id: string;
  group_no: number;
  issued_date: string;
  expiration_date: string;
  used_coupon: "T" | "F";
  used_date: string | null;
  related_order_id: string | null;
}

export interface CouponIssuanceCustomerLink {
  rel: string;
  href: string;
}

export interface CouponIssuanceCustomersResponse {
  issuancecustomers: CouponIssuanceCustomer[];
  links?: CouponIssuanceCustomerLink[];
}

export interface CouponIssuanceCustomersParams {
  shop_no?: number;
  coupon_no: string;
  member_id?: string;
  group_no?: number;
  since_member_id?: string;
  limit?: number;
  offset?: number;
}
